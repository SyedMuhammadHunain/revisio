import { Component } from '@angular/core';
import {
  FormGroupName,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { comparePassword } from './validators';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  signupForm = new FormGroup({
    userName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern('^(?=.*\\d)(?=.*[@$!%*?&]).+$'),
          ],
        }),
        confirmPassword: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern('^(?=.*\\d)(?=.*[@$!%*?&]).+$'),
          ],
        }),
      },
      {
        validators: [comparePassword('password', 'confirmPassword')],
      }
    ),
  });

  onSubmitSignupForm() {
    console.log(this.signupForm);
  }
}
