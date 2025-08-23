import { Component, inject, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import {
  FormGroupName,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { comparePassword } from './validators';
import { EmailValidatorService } from '../../services/email-validator.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgHcaptchaModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  showErrorBox = false;
  showSuccessBox = false;

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
    hcaptcha: new FormControl('', {
      validators: [Validators.required],
    }),
  });

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

  get hcaptchaInvalid() {
    return (
      this.signupForm.controls.hcaptcha.touched &&
      this.signupForm.controls.hcaptcha.invalid &&
      this.signupForm.controls.hcaptcha.dirty
    );
  }

  onSubmitSignupForm() {
    if (this.signupForm.invalid) {
      this.showErrorBox = true;
      setTimeout(() => (this.showErrorBox = false), 3000);
      return;
    }

    this.showSuccessBox = true;
    setTimeout(() => (this.showSuccessBox = false), 3000);
    console.log('VALID FORM');
  }
}
