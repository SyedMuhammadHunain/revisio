import { Routes } from '@angular/router';

import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ResendOtpComponent } from './auth/sign-in/resend-otp/resend-otp.component';
import { ForgotPasswordComponent } from './auth/sign-in/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/sign-in/forgot-password/reset-password/reset-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssessmentComponent } from './dashboard/assessment/assessment.component';
import { TestResultComponent } from './dashboard/test-result/test-result.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { authGuard } from './auth/auth.guard';
import { UnAuthorizedComponent } from './shared/un-authorized/un-authorized.component';
import { OverviewComponent } from './dashboard/overview/overview.component';

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
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard',
    // canActivate: [authGuard],
    children: [
      {
        path: 'assessment',
        component: AssessmentComponent,
      },
      {
        path: 'test-result',
        component: TestResultComponent,
      },
      {
        path: 'overview',
        component: OverviewComponent,
      },
    ],
  },
  {
    path: 'un-authorize',
    component: UnAuthorizedComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
