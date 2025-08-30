import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { SigninData } from '../../models/auth.model';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

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

  onSubmitSigninForm() {
    if (this.signinForm.valid) {
      const signinData: SigninData = this.signinForm.value as SigninData;

      const subscription = this.authService.signIn(signinData).subscribe({
        next: (response) => console.log(response),
        error: (error) => console.error('Signin failed: ', error),
        complete: () => console.log('Completed Sign in Flow.'),
      });

    } else {
      this.messageService.setMessage(
        'Please fill in all the required fields.',
        'error'
      );
      return;
    }
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
