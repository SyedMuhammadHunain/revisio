import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
import { catchError, of, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailValidatorService {
  private API_URL = environment.API_URL;
  private httpClient = inject(HttpClient);

  // Async Validator
  checkUniqueEmail(control: AbstractControl) {
    return this.httpClient
      .post<{ exists: boolean }>(`${this.API_URL}/email/check`, {
        email: control.value,
      })
      .pipe(
        map((response) => {
          return response.exists ? { emailTaken: true } : null;
        }),
        catchError((error) => {
          console.error(error);
          return of(null);
        })
      );
  }
}
