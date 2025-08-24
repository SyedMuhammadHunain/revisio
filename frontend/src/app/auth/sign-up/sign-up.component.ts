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
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';

import { Signup } from '../../models/signup.model';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgHcaptchaModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  private emailValidatorService = inject(EmailValidatorService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  signupForm = new FormGroup({
    username: new FormControl('', {
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
    // hcaptcha: new FormControl('', {
    //   validators: [Validators.required],
    // }),
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
      this.signupForm.controls.username.touched &&
      this.signupForm.controls.username.invalid &&
      this.signupForm.controls.username.dirty
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

  // get hcaptchaInvalid() {
  //   return (
  //     this.signupForm.controls.hcaptcha.touched &&
  //     this.signupForm.controls.hcaptcha.invalid &&
  //     this.signupForm.controls.hcaptcha.dirty
  //   );
  // }

  onSubmitSignupForm() {
    if (this.signupForm.valid) {
      const signupData: Signup = {
        username: this.signupForm.controls.username.value as string,
        email: this.signupForm.controls.email.value as string,
        password: this.signupForm.controls.passwords.controls.password
          .value as string,
      };

      const subscription = this.authService.signup(signupData).subscribe({
        next: (response) => console.log('Signup successful:', response),
        error: (error) => console.error('Signup failed:', error),
        complete: () => this.signupForm.reset(),
      });
    }

    this.messageService.setMessage(
      'Please fill in all the required fields.',
      'error'
    );
  }
}
