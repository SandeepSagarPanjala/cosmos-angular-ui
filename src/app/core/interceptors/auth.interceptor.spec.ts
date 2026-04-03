import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';

import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor', () => {
  it('skips adding Authorization header for /api/auth/* requests', async () => {
    const authService = { getAccessToken: () => 'abc' } as unknown as AuthService;
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authService }],
    });

    const req = new HttpRequest('GET', '/api/auth/login');
    const next = vi.fn((_r: HttpRequest<unknown>) =>
      of(new HttpResponse({ status: 200, body: { ok: true } })),
    );

    await TestBed.runInInjectionContext(async () => {
      await firstValueFrom(authInterceptor(req, next));
    });

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(req);
  });

  it('adds Bearer token when token exists', async () => {
    const authService = { getAccessToken: () => 'abc' } as unknown as AuthService;
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authService }],
    });

    const req = new HttpRequest('GET', '/api/users');
    const next = vi.fn((_r: HttpRequest<unknown>) => of(new HttpResponse({ status: 200 })));

    await TestBed.runInInjectionContext(async () => {
      await firstValueFrom(authInterceptor(req, next));
    });

    const calledReq = next.mock.calls[0]?.[0] as HttpRequest<unknown>;
    expect(calledReq.headers.get('Authorization')).toBe('Bearer abc');
  });
});
