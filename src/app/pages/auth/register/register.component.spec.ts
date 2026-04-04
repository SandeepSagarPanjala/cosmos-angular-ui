import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { type MockInstance } from 'vitest';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Messages } from '../../../core/constants/messages.constants';
import { AddUserMutation } from '../../../core/services/auth/auth.generated';

describe('RegisterComponent', () => {
  let navigateSpy: MockInstance<Router['navigate']>;
  let registerSpy: MockInstance<AuthService['register']>;

  beforeEach(() => {
    const authServiceMock = {
      register: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    const router = TestBed.inject(Router);
    const authService = TestBed.inject(AuthService);

    navigateSpy = vi.spyOn(router, 'navigate');
    registerSpy = vi.spyOn(authService, 'register');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does nothing when the form is invalid', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;

    component.onSubmit();

    expect(registerSpy).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('registers and navigates to /login on success', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;

    registerSpy.mockReturnValue(of({ id: '1', username: 'dev' } as AddUserMutation['addUser']));

    component.registerForm.setValue({ 
        username: 'valid_username', 
        password: 'password123', 
        email: 'test@example.com' 
    });

    component.onSubmit();

    expect(registerSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('sets error and stops loading when registration fails', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;

    registerSpy.mockReturnValue(throwError(() => ({ message: 'User already exists' })));

    component.registerForm.setValue({ 
        username: 'valid_username', 
        password: 'password123', 
        email: 'test@example.com' 
    });
    component.onSubmit();

    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBe('User already exists');
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('falls back to default message when error has no message', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;

    registerSpy.mockReturnValue(throwError(() => ({})));

    component.registerForm.setValue({ 
        username: 'valid_username', 
        password: 'password123', 
        email: 'test@example.com' 
    });

    component.onSubmit();

    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBe(Messages.Auth.RegistrationFailed);
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
