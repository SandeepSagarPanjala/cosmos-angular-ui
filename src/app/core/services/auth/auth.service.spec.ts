import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { type MockInstance, vi, type Mock } from 'vitest';

import { AuthService } from './auth.service';
import { environment } from '../../../../environments/environment';
import {
  LoginUserGQL,
  RefreshSessionGQL,
  LogoutUserGQL,
  AddUserGQL,
  LoginUserMutation,
  AddUserMutation,
} from './auth.generated';

// Local interface to maintain strictness without elusive imports
interface MockMutationResult<T> {
  data?: T | null;
  loading: boolean;
}

describe('AuthService', () => {
  let service: AuthService;
  let routerMock: Partial<Router>;
  let loginGQLMock: Partial<LoginUserGQL>;
  let refreshGQLMock: Partial<RefreshSessionGQL>;
  let logoutGQLMock: Partial<LogoutUserGQL>;
  let addUserGQLMock: Partial<AddUserGQL>;

  beforeEach(() => {
    localStorage.clear();

    routerMock = {
      navigate: vi.fn() as Mock<Router['navigate']>,
    };

    loginGQLMock = {
      mutate: vi.fn() as Mock<LoginUserGQL['mutate']>,
    };
    refreshGQLMock = {
      mutate: vi.fn() as Mock<RefreshSessionGQL['mutate']>,
    };
    logoutGQLMock = {
      mutate: vi.fn() as Mock<LogoutUserGQL['mutate']>,
    };
    addUserGQLMock = {
      mutate: vi.fn() as Mock<AddUserGQL['mutate']>,
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerMock },
        { provide: LoginUserGQL, useValue: loginGQLMock },
        { provide: RefreshSessionGQL, useValue: refreshGQLMock },
        { provide: LogoutUserGQL, useValue: logoutGQLMock },
        { provide: AddUserGQL, useValue: addUserGQLMock },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('tracks isAuthenticated based on localStorage', async () => {
    localStorage.setItem(environment.tokenStorageKey, 'fake_token');

    const newService = TestBed.runInInjectionContext(() => new AuthService());

    expect(newService.getAccessToken()).toBe('fake_token');
    expect(newService.isAuthenticated()).toBe(true);
  });

  it('saveTokens stores token and flips signal true', () => {
    service.saveTokens({ accessToken: 'new_token' });
    expect(localStorage.getItem(environment.tokenStorageKey)).toBe('new_token');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('clearTokens removes token and flips signal false', () => {
    service.saveTokens({ accessToken: 'bye' });
    service.clearTokens();
    expect(localStorage.getItem(environment.tokenStorageKey)).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('login calls loginGQL and saves tokens on success', () => {
    const mockRes: MockMutationResult<LoginUserMutation> = {
      data: {
        loginUser: {
          accessToken: 'abc',
          __typename: 'AuthPayload' as const,
        },
      },
      loading: false,
    };

    (loginGQLMock.mutate as MockInstance).mockReturnValue(of(mockRes));

    service.login({ username: 'u', password: 'p' }).subscribe();

    expect(loginGQLMock.mutate).toHaveBeenCalled();
    expect(service.isAuthenticated()).toBe(true);
    expect(localStorage.getItem(environment.tokenStorageKey)).toBe('abc');
  });

  it('register calls addUserGQL', () => {
    const mockRes: MockMutationResult<AddUserMutation> = {
      data: {
        addUser: {
          id: '1',
          username: 'u',
          __typename: 'User' as const,
        },
      },
      loading: false,
    };

    (addUserGQLMock.mutate as MockInstance).mockReturnValue(of(mockRes));

    service.register({ username: 'u', password: 'p', email: 'e' }).subscribe();

    expect(addUserGQLMock.mutate).toHaveBeenCalled();
  });

  it('logout calls logoutGQL and navigates to login', () => {
    const mockRes: MockMutationResult<boolean> = {
      loading: false,
    };

    (logoutGQLMock.mutate as MockInstance).mockReturnValue(of(mockRes));

    service.logout();

    expect(logoutGQLMock.mutate).toHaveBeenCalled();
    expect(service.isAuthenticated()).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
