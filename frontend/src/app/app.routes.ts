import { Routes } from '@angular/router';

import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ResendOtpComponent } from './auth/sign-in/resend-otp/resend-otp.component';
import { ForgotPasswordComponent } from './auth/sign-in/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/sign-in/forgot-password/reset-password/reset-password.component';

export const routes: Routes = [
  {
    path: '',
    component: SignUpComponent,
    title: 'Sign Up',
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    title: 'Sign In',
    children: [
      {
        path: 'resend-otp',
        component: ResendOtpComponent,
        title: 'Resend Otp',
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        title: 'Forgot Password',
        children: [
          { path: 'reset-password', component: ResetPasswordComponent },
        ],
      },
    ],
  },
];
