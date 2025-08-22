import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroupName,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { comparePassword } from './validators';
import { EmailValidatorService } from '../services/email-validator.service';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  captchaToken = '';
  private emailValidatorService = inject(EmailValidatorService);

  signupForm = new FormGroup({
    userName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(4)],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [
        this.emailValidatorService.checkUniqueEmail.bind(
          this.emailValidatorService
        ),
      ],
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

  get confirmPasswordInvalid() {
    return (
      this.signupForm.controls.passwords.controls.confirmPassword.touched &&
      this.signupForm.controls.passwords.controls.confirmPassword.invalid &&
      this.signupForm.controls.passwords.controls.confirmPassword.dirty
    );
  }

  // Receives hCaptcha Token
  // onCaptchaSolve Global function
  ngOnInit() {
    (window as any).onCaptchaSuccess = (token: string) => {
      this.captchaToken = token;
    };
  }
}
