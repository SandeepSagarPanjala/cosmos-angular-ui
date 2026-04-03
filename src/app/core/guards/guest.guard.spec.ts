import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { guestGuard } from './guest.guard';
import { AuthService } from '../services/auth.service';

describe('guestGuard', () => {
  it('redirects to /dashboard when authenticated', () => {
    const router = { navigate: vi.fn() };
    const authService = { isAuthenticated: () => true } as unknown as AuthService;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
      ],
    });

    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as unknown as ActivatedRouteSnapshot, {} as unknown as RouterStateSnapshot),
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('allows navigation when not authenticated', () => {
    const router = { navigate: vi.fn() };
    const authService = { isAuthenticated: () => false } as unknown as AuthService;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
      ],
    });

    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as unknown as ActivatedRouteSnapshot, {} as unknown as RouterStateSnapshot),
    );

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
