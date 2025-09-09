// frontend/src/app/auth/auth.interceptor.ts
import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { LocalStorageService } from '../services/local-storage.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const localStorageService = inject(LocalStorageService);
    const token = localStorageService.getAccessToken();

    if (token) {
        const authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
        });
        return next(authReq);
    }

    return next(req);
};