import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Use the reactive Signal to check if they have tokens securely
  if (authService.isAuthenticated()) {
    return true; // Let them pass into the dashboard room
  }

  // Not logged in! Kick them out to the login page immediately.
  router.navigate(['/login']);
  return false;
};
