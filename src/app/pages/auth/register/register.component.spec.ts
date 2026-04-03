import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { type MockInstance } from 'vitest'; // Import the type

import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/services/auth.service';
import { ApiRoutes } from '../../../core/constants/api.constants';
import { Messages } from '../../../core/constants/messages.constants';

describe('RegisterComponent', () => {
  // Use MockInstance to strongly type the spy
  let navigateSpy: MockInstance<Router['navigate']>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: {} },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    const router = TestBed.inject(Router);
    // Vitest automatically infers the types here
    navigateSpy = vi.spyOn(router, 'navigate');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does nothing when the form is invalid', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;
    const http = TestBed.inject(HttpTestingController);

    component.onSubmit();

    http.verify();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('registers and navigates to /login on success', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;
    const http = TestBed.inject(HttpTestingController);

    component.registerForm.setValue({ username: 'developer_21', password: 'pw' });

    component.onSubmit();

    const req = http.expectOne(ApiRoutes.Users.Add);
    expect(req.request.method).toBe('POST');

    req.flush({ ok: true });

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    http.verify();
  });

  it('sets error and stops loading when registration fails', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;
    const http = TestBed.inject(HttpTestingController);

    component.registerForm.setValue({ username: 'x', password: 'y' });
    component.onSubmit();

    const req = http.expectOne(ApiRoutes.Users.Add);

    // FIX: Remove the outer "error" wrapper
    req.flush(
      { message: 'User already exists' }, // This is the body (err.error)
      { status: 400, statusText: 'Bad Request' },
    );

    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBe('User already exists');
    expect(navigateSpy).not.toHaveBeenCalled();

    http.verify();
  });

  it('falls back to default message when error has no message', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;
    const http = TestBed.inject(HttpTestingController);

    component.registerForm.setValue({ username: 'x', password: 'y' });

    component.onSubmit();

    const req = http.expectOne(ApiRoutes.Users.Add);
    req.flush({ error: {} }, { status: 400, statusText: 'Bad Request' });

    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBe(Messages.Auth.RegistrationFailed);
    expect(navigateSpy).not.toHaveBeenCalled();

    http.verify();
  });
});
