import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Signup } from '../models/signup.model';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);

  signup(signupData: Signup) {
    return this.httpClient
      .post('http://localhost:3000/auth/signup', signupData)
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error('Failed to Sign up. Please try again.')
          );
        })
      );
  }

  login() {}
}
