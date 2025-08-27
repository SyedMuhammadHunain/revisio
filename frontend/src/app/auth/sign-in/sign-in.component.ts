import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  signinForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(4)],
    }),
    code: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^[A-Z0-9]+$/),
      ],
    }),
  });

  get emailInvalid() {
    return (
      this.signinForm.controls.email.touched &&
      this.signinForm.controls.email.invalid &&
      this.signinForm.controls.email.dirty
    );
  }

  get passwordInvalid() {
    return (
      this.signinForm.controls.password.touched &&
      this.signinForm.controls.password.invalid &&
      this.signinForm.controls.password.dirty
    );
  }

  get codeInvalid() {
    return (
      this.signinForm.controls.code.touched &&
      this.signinForm.controls.code.invalid &&
      this.signinForm.controls.code.dirty
    );
  }

  onSubmitSigninForm(): void {
    console.log('Sign In Form submitted!');
  }

  onForgotPassword(): void {
    console.log(
      'Forgot password link clicked. This would navigate to a password reset page.'
    );
  }

  onDidntGetCode(): void {
    console.log(
      "Didn't get code link clicked. This would trigger a resend code action."
    );
  }

  onSignUp(): void {
    console.log(
      'Sign up link clicked. This would navigate to the sign-up page.'
    );
  }
}
