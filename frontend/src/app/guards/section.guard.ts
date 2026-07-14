import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const sectionGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredSection = route.data['section'] as string;

  if (authService.hasSection(requiredSection)) {
    return true;
  }

  router.navigate(['/access-denied']);
  return false;
};