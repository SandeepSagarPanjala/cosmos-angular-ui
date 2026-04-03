import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { type MockInstance } from 'vitest';

import { DashboardComponent } from './dashboard.component';
import { ApiRoutes } from '../../core/constants/api.constants';
import { AuthService } from '../../core/services/auth.service';

describe('DashboardComponent', () => {
  let logoutSpy: MockInstance<AuthService['logout']>;
  let httpController: HttpTestingController;

  beforeEach(() => {
    const authServiceMock = {
      logout: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    // Inject dependencies
    const authService = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);

    // Set up spies
    logoutSpy = vi.spyOn(authService, 'logout');
  });

  afterEach(() => {
    // verify() ensures no unmatched/unexpected HTTP requests are outstanding
    httpController.verify();
    vi.restoreAllMocks();
  });

  it('fires secure API request', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const component = fixture.componentInstance;

    component.testSecureApi();

    // expectOne validates that the exact URL was called
    const req = httpController.expectOne(ApiRoutes.Users.GetAll);
    expect(req.request.method).toBe('GET');

    // Simulate a successful API response
    req.flush([{ id: 1 }]);
  });

  it('delegates logout to AuthService', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const component = fixture.componentInstance;

    component.logout();

    // Verify that the component doesn't handle logout itself, but calls the service
    expect(logoutSpy).toHaveBeenCalled();
  });
});
