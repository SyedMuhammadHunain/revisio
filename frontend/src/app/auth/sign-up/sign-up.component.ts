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

import { Router, RouterLink } from '@angular/router';

import { comparePassword } from './validators';
import { EmailValidatorService } from '../../services/email-validator.service';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';

import { SignupData } from '../../models/auth.model';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgHcaptchaModule, RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  private emailValidatorService = inject(EmailValidatorService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private router = inject(Router);

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
    { validators: [comparePassword] }
    // hcaptcha: new FormControl('', {
    //   validators: [Validators.required],
    // }),
  );

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
      this.signupForm.controls.password.touched &&
      this.signupForm.controls.password.invalid &&
      this.signupForm.controls.password.dirty
    );
  }

  get confirmPasswordInvalid() {
    return (
      this.signupForm.controls.confirmPassword.touched &&
      this.signupForm.controls.confirmPassword.invalid &&
      this.signupForm.controls.confirmPassword.dirty
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
      const signupData: SignupData = this.signupForm.value as SignupData;

      const subscription = this.authService.signup(signupData).subscribe({
        next: (response) => console.log('Signup successful:', response),
        error: (error) => console.error('Signup failed: ', error),
        complete: () => {
          this.router.navigate(['signin']);
          this.signupForm.reset();
        },
      });
    } else {
      this.messageService.setMessage(
        'Please fill in all the required fields.',
        'error'
      );
      return;
    }
  }
}
