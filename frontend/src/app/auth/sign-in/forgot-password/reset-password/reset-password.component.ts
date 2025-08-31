// reset-password.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../services/auth.service';
import { MessageService } from '../../../../services/message.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  resetPasswordForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    code: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^[A-Z0-9]+$/),
      ],
    }),
    newPassword: new FormControl('', {
      validators: [Validators.required, Validators.minLength(4)],
    }),
    confirmPassword: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  get emailInvalid() {
    return (
      this.resetPasswordForm.controls.email.touched &&
      this.resetPasswordForm.controls.email.invalid &&
      this.resetPasswordForm.controls.email.dirty
    );
  }

  get codeInvalid() {
    return (
      this.resetPasswordForm.controls.code.touched &&
      this.resetPasswordForm.controls.code.invalid &&
      this.resetPasswordForm.controls.code.dirty
    );
  }

  get newPasswordInvalid() {
    return (
      this.resetPasswordForm.controls.newPassword.touched &&
      this.resetPasswordForm.controls.newPassword.invalid &&
      this.resetPasswordForm.controls.newPassword.dirty
    );
  }

  get confirmPasswordInvalid() {
    const confirmPassword = this.resetPasswordForm.controls.confirmPassword;
    const newPassword = this.resetPasswordForm.controls.newPassword;
    
    return (
      confirmPassword.touched &&
      confirmPassword.dirty &&
      (confirmPassword.invalid || confirmPassword.value !== newPassword.value)
    );
  }

  onSubmitResetPasswordForm() {
    if (this.resetPasswordForm.valid && this.passwordsMatch()) {
      const { email, code, newPassword } = this.resetPasswordForm.value;
      
      const resetData = {
        email: email as string,
        code: code as string,
        newPassword: newPassword as string,
      };

      const subscription = this.authService.resetPassword(resetData).subscribe({
        next: (response) => {
          console.log(response);
          // Navigate to sign-in after successful password reset
          this.router.navigate(['/sign-in']);
        },
        error: (error) => console.error('Reset password failed: ', error),
        complete: () => console.log('Completed Reset Password Flow.'),
      });

    } else {
      this.messageService.setMessage(
        'Please fill in all fields correctly and ensure passwords match.',
        'error'
      );
      return;
    }
  }

  private passwordsMatch(): boolean {
    const newPassword = this.resetPasswordForm.controls.newPassword.value;
    const confirmPassword = this.resetPasswordForm.controls.confirmPassword.value;
    return newPassword === confirmPassword;
  }
}