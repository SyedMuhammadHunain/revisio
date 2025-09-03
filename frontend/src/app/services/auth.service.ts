import { inject, Injectable, signal } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { SigninData, SignupData } from '../models/auth.model';

import { MessageService } from './message.service';
import { LocalStorageService } from './local-storage.service';

import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);
  private messageService = inject(MessageService);

  signup(signupData: SignupData) {
    return this.httpClient
      .post<{ message: string }>(
        'http://localhost:3000/auth/signup',
        signupData
      )
      .pipe(
        map((response) => {
          this.messageService.setMessage(response.message, 'success');
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          this.messageService.setMessage(error.error.message, 'error');
          return throwError(() => error);
        })
      );
  }

  signIn(signinData: SigninData) {
    return this.httpClient
      .post<{ accessToken: string; message: string }>(
        'http://localhost:3000/auth/signin',
        signinData
      )
      .pipe(
        map((response) => {
          const accessToken = response.accessToken;
          this.localStorageService.saveAccessToken(accessToken);
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          this.messageService.setMessage(error.error.message, 'error');
          return throwError(() => error);
        })
      );
  }

  resendOtp(email: string) {
    return this.httpClient
      .post<{ message: string }>('http://localhost:3000/auth/resend-otp', {
        email,
      })
      .pipe(
        map((response) => {
          this.messageService.setMessage(response.message, 'success');
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          this.messageService.setMessage(error.error.message, 'error');
          return throwError(() => error);
        })
      );
  }

  forgotPassword(email: string) {
    return this.httpClient
      .post<{ message: string }>('http://localhost:3000/auth/forgot-password', {
        email,
      })
      .pipe(
        map((response) => {
          this.messageService.setMessage(response.message, 'success');
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          this.messageService.setMessage(error.error.message, 'error');
          return throwError(() => error);
        })
      );
  }

  resetPassword(resetData: {
    email: string;
    code: string;
    newPassword: string;
  }) {
    return this.httpClient
      .post<{ message: string }>(
        'http://localhost:3000/auth/reset-password',
        resetData
      )
      .pipe(
        map((response) => {
          this.messageService.setMessage(response.message, 'success');
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          this.messageService.setMessage(error.error.message, 'error');
          return throwError(() => error);
        })
      );
  }
}
