import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { ApiRoutes } from '../constants/api.constants';

describe('AuthService', () => {
  const router = { navigate: vi.fn() };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
      ],
    });
  });

  it('tracks isAuthenticated based on localStorage', () => {
    expect(TestBed.inject(AuthService).isAuthenticated()).toBe(false);

    localStorage.setItem(environment.tokenStorageKey, 't1');
    expect(TestBed.inject(AuthService).getAccessToken()).toBe('t1');
  });

  it('saveTokens stores token and flips signal true', () => {
    const service = TestBed.inject(AuthService);
    service.saveTokens({ accessToken: 'abc' });

    expect(localStorage.getItem(environment.tokenStorageKey)).toBe('abc');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('clearTokens removes token and flips signal false', () => {
    const service = TestBed.inject(AuthService);
    service.saveTokens({ accessToken: 'abc' });

    service.clearTokens();
    expect(localStorage.getItem(environment.tokenStorageKey)).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('logout clears tokens and navigates to /login (even when API fails)', () => {
    const service = TestBed.inject(AuthService);
    const httpMock = TestBed.inject(HttpTestingController);

    service.saveTokens({ accessToken: 'abc' });
    service.logout();

    const req = httpMock.expectOne(ApiRoutes.Auth.Logout);
    expect(req.request.withCredentials).toBe(true);
    req.flush('nope', { status: 500, statusText: 'Server Error' });

    expect(localStorage.getItem(environment.tokenStorageKey)).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);

    httpMock.verify();
  });
});

