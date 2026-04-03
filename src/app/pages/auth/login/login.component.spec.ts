import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { type MockInstance } from 'vitest';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { Messages } from '../../../core/constants/messages.constants';

describe('LoginComponent', () => {
  let navigateSpy: MockInstance<Router['navigate']>;
  // We use MockInstance for the service method to keep it type-safe
  let loginSpy: MockInstance<AuthService['login']>;

  beforeEach(() => {
    // Create a mock object for AuthService that matches the interface
    const authServiceMock = {
      login: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: authServiceMock }],
    });

    const router = TestBed.inject(Router);
    const authService = TestBed.inject(AuthService);

    navigateSpy = vi.spyOn(router, 'navigate');
    loginSpy = vi.spyOn(authService, 'login');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does nothing when the form is invalid', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    // Verify initial state
    expect(component.loginForm.invalid).toBe(true);

    component.onSubmit();

    expect(loginSpy).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('navigates to /dashboard on successful login', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    // Mock successful response
    loginSpy.mockReturnValue(of({}));

    component.loginForm.setValue({ username: 'user1', password: 'pass1' });
    component.onSubmit();

    expect(loginSpy).toHaveBeenCalledWith({
      username: 'user1',
      password: 'pass1',
    });

    // Check loading state (assuming it's a signal)
    expect(component.isLoading()).toBe(true);
    expect(component.error()).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });

  it('sets error and stops loading when login fails', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    // Mock error response - Flattening the structure to match component access
    loginSpy.mockReturnValue(throwError(() => ({ error: { message: 'Invalid credentials' } })));

    component.loginForm.setValue({ username: 'user1', password: 'bad' });
    component.onSubmit();

    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBe('Invalid credentials');
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('falls back to default message when error has no message', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    // Mock empty error response
    loginSpy.mockReturnValue(throwError(() => ({ error: {} })));

    component.loginForm.setValue({ username: 'user1', password: 'bad' });
    component.onSubmit();

    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBe(Messages.Auth.LoginFailed);
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
