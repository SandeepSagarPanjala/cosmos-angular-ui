import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';

import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth/auth.service';

describe('authInterceptor', () => {
  it('skips adding Authorization header for Auth-related GraphQL operations', async () => {
    const authService = { getAccessToken: () => 'abc' } as unknown as AuthService;
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authService }],
    });

    // Simulate a GraphQL Login request
    const req = new HttpRequest('POST', '/graphql', { operationName: 'LoginUser' });
    const next = vi.fn((_r: HttpRequest<unknown>) =>
      of(new HttpResponse({ status: 200, body: { data: { loginUser: {} } } })),
    );

    await TestBed.runInInjectionContext(async () => {
      await firstValueFrom(authInterceptor(req, next));
    });

    expect(next).toHaveBeenCalledTimes(1);
    // Should NOT have added Authorization header
    const calledReq = next.mock.calls[0]?.[0] as HttpRequest<unknown>;
    expect(calledReq.headers.has('Authorization')).toBe(false);
  });

  it('adds Bearer token when token exists for non-auth requests', async () => {
    const authService = { getAccessToken: () => 'abc' } as unknown as AuthService;
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authService }],
    });

    const req = new HttpRequest('GET', '/graphql', { operationName: 'GetData' });
    const next = vi.fn((_r: HttpRequest<unknown>) => of(new HttpResponse({ status: 200 })));

    await TestBed.runInInjectionContext(async () => {
      await firstValueFrom(authInterceptor(req, next));
    });

    const calledReq = next.mock.calls[0]?.[0] as HttpRequest<unknown>;
    expect(calledReq.headers.get('Authorization')).toBe('Bearer abc');
  });
});
