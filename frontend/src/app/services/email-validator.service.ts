import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
import { catchError, of, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailValidatorService {
  private httpClient = inject(HttpClient);

  // Async Validator
  checkUniqueEmail(control: AbstractControl) {
    return this.httpClient
      .post<boolean>('http://localhost:3000/email', { email: control.value })
      .pipe(
        map((response: boolean) => {
          return response ? { emailTaken: true } : null;
        }),
        catchError((error) => {
          console.error(error);
          return of(null);
        })
      );
  }
}
