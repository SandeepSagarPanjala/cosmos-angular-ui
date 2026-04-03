import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  LoginUserGQL, 
  RefreshSessionGQL, 
  LogoutUserGQL,
  LoginUserMutationVariables,
  LoginUserMutation,
  AddUserGQL,
  AddUserMutationVariables,
  AddUserMutation
} from './auth.generated';

export interface Tokens {
  accessToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  
  // Natively inject the Auto-Generated Pothos GQL Classes!
  private readonly loginGQL = inject(LoginUserGQL);
  private readonly refreshGQL = inject(RefreshSessionGQL);
  private readonly logoutGQL = inject(LogoutUserGQL);
  private readonly addUserGQL = inject(AddUserGQL);
  
  // Reactive UI tracking: automatically updates if logged in state changes
  public readonly isAuthenticated = signal<boolean>(!!this.getAccessToken());

  getAccessToken(): string | null {
    return localStorage.getItem(environment.tokenStorageKey);
  }

  saveTokens(tokens: Tokens): void {
    localStorage.setItem(environment.tokenStorageKey, tokens.accessToken);
    this.isAuthenticated.set(true); 
  }

  clearTokens(): void {
    localStorage.removeItem(environment.tokenStorageKey);
    this.isAuthenticated.set(false); 
  }

  login(credentials: LoginUserMutationVariables): Observable<LoginUserMutation['loginUser']> {
    // 100% Mathematically verified execution via Pothos Graph!
    return this.loginGQL.mutate({
      variables: {
        username: credentials.username,
        password: credentials.password
      }
    }).pipe(
      map(res => res.data?.loginUser),
      tap(authData => {
        if (authData?.accessToken) {
          this.saveTokens({ accessToken: authData.accessToken });
        }
      })
    );
  }

  // The Silent Rotation Function via Generated GraphQL
  refreshTokens(): Observable<Tokens> {
    return this.refreshGQL.mutate().pipe(
      map(res => res.data?.refreshSession as Tokens),
      tap(authData => {
        if (authData?.accessToken) {
          this.saveTokens({ accessToken: authData.accessToken });
        }
      }),
      catchError(err => {
        // If refresh fails in GraphQL, we must exit completely!
        this.executeLogout();
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    this.logoutGQL.mutate().subscribe({
      next: () => this.executeLogout(),
      error: () => this.executeLogout()
    });
  }

  private executeLogout(): void {
    this.clearTokens();
    this.router.navigate(['/login']);
  }

  register(variables: AddUserMutationVariables): Observable<AddUserMutation['addUser']> {
    return this.addUserGQL.mutate({ variables }).pipe(
      map(res => res.data?.addUser)
    );
  }
}
