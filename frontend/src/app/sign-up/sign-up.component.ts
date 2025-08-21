import { Component } from '@angular/core';
import {
  FormGroupName,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { comparePassword } from './validators';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  signupForm = new FormGroup({
    userName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(4)],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(4),
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
    if (this.signupForm.invalid) {
      console.log('INVALID');
      return;
    }
  }

  // Form Validations
  get emailInvalid() {
    return (
      this.signupForm.controls.email.touched &&
      this.signupForm.controls.email.invalid &&
      this.signupForm.controls.email.dirty
    );
  }

  get usernameInvalid() {
    return (
      this.signupForm.controls.userName.touched &&
      this.signupForm.controls.userName.invalid &&
      this.signupForm.controls.userName.dirty
    );
  }

  get passwordInvalid() {
    return (
      this.signupForm.controls.passwords.controls.password.touched &&
      this.signupForm.controls.passwords.controls.password.invalid &&
      this.signupForm.controls.passwords.controls.password.dirty
    );
  }
}
