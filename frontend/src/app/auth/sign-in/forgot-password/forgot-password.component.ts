import { CommonModule } from '@angular/common';
import { Component, inject, Output, EventEmitter } from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  Router,
  ActivatedRoute,
  RouterLink,
  RouterOutlet,
} from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterOutlet],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  @Output() loading = new EventEmitter<boolean>();

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
  });

  get emailInvalid() {
    return (
      this.forgotPasswordForm.controls.email.touched &&
      this.forgotPasswordForm.controls.email.invalid &&
      this.forgotPasswordForm.controls.email.dirty
    );
  }

  onSubmitForgotPasswordForm() {
    if (this.forgotPasswordForm.valid) {
      this.loading.emit(true);
      const email = this.forgotPasswordForm.value.email as string;

      const subscription = this.authService.forgotPassword(email).subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(['reset-password'], {
            relativeTo: this.activatedRoute,
          });
        },
        error: (error) => {
          this.loading.emit(false);
          console.error('Forgot password failed: ', error);
        },
        complete: () => {
          this.loading.emit(false);
          console.log('Completed Forgot Password Flow.');
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

  // Check if a child route is currently active
  get isChildRouteActive() {
    return this.activatedRoute.children.length > 0;
  }
}
