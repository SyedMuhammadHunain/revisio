import { CommonModule } from '@angular/common';
import { Component, inject, Output, EventEmitter } from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-resend-otp',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './resend-otp.component.html',
  styleUrl: './resend-otp.component.css',
})
export class ResendOtpComponent {
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  @Output() loading = new EventEmitter<boolean>();

  resendOtpForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
  });

  get emailInvalid() {
    return (
      this.resendOtpForm.controls.email.touched &&
      this.resendOtpForm.controls.email.invalid &&
      this.resendOtpForm.controls.email.dirty
    );
  }

  onSubmitResendOtpForm() {
    if (this.resendOtpForm.valid) {
      this.loading.emit(true);

      const email = this.resendOtpForm.value.email as string;

      const subscription = this.authService.resendOtp(email).subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(['/sign-in']);
        },
        error: (error) => {
          this.loading.emit(false);
          console.error('Resend OTP failed: ', error);
        },
        complete: () => {
          this.loading.emit(false);
          console.log('Completed Resend OTP Flow.');
        },
      });
    } else {
      this.messageService.setMessage(
        'Please enter a valid email address.',
        'error'
      );
      return;
    }
  }
}
