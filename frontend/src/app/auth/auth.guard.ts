import { inject } from '@angular/core';

import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

import { LocalStorageService } from '../services/local-storage.service';
import { MessageService } from '../services/message.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const localStorage = inject(LocalStorageService);
  const messageService = inject(MessageService);
  const router = inject(Router);

  const token = localStorage.getAccessToken();

  if (!token) {
    messageService.setMessage('Please sign in to access this page.', 'error');
    router.navigate(['/sign-in']);
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < currentTime) {
      localStorage.clearAccessToken(); 
      messageService.setMessage(
        'Your session has expired. Please sign in again.',
        'error'
      );
      router.navigate(['/sign-in']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Auth Guard: Invalid token format', error);
    localStorage.clearAccessToken(); // Clear invalid token
    messageService.setMessage(
      'Invalid authentication. Please sign in again.',
      'error'
    );
    router.navigate(['/sign-in']);
    return false;
  }
};
