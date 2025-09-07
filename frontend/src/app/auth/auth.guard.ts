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

  if (token) {
    return true;
  } else {
    messageService.setMessage('Unauthorized Access. Please sign in.', 'error');
    router.navigate(['sign-in']);
    return false;
  }
};
