import { HttpEvent, HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(
  null,
);

export const authInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  // 1. Skip if the request is an Auth-related GraphQL mutation (avoids infinite loops)
  const skipOperations = ['LoginUser', 'RefreshSession', 'AddUser'];
  const body = req.body as { operationName?: string } | null;

  if (body && body.operationName && skipOperations.includes(body.operationName)) {
    return next(req);
  }

  // 2. Automatically attach Bearer token if it exists in LocalStorage
  let authReq = req;
  const token = authService.getAccessToken();
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  // 3. Handle responses & catch 401s specifically
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return handle401Error(authReq, next, authService);
      }
      return throwError(() => error);
    }),
  );
};

const handle401Error = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
) => {
  if (!isRefreshing) {
    // Lock the interceptor so we don't spam the server with refresh requests
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshTokens().pipe(
      switchMap((tokenResponse: { accessToken: string }) => {
        isRefreshing = false;
        refreshTokenSubject.next(tokenResponse.accessToken);

        // Success! Re-execute the original blocked request flawlessly with the new token
        return next(
          req.clone({ setHeaders: { Authorization: `Bearer ${tokenResponse.accessToken}` } }),
        );
      }),
      catchError((err) => {
        // FAIL condition: the refresh token itself expired (7 days)
        // OR token theft logic generated a 403 on the Node API!
        isRefreshing = false;
        authService.clearTokens(); // Wipe everything instantly
        window.location.href = '/login'; // Brutal jump to login page to protect app
        return throwError(() => err);
      }),
    );
  } else {
    // If we are ALREADY refreshing and a second HTTP request triggers a 401 simultaneously,
    // queue it up by having it wait for the Subject to resolve before proceeding!
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((jwt) => {
        return next(req.clone({ setHeaders: { Authorization: `Bearer ${jwt}` } }));
      }),
    );
  }
};
