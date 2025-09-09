import { Routes } from '@angular/router';

import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ResendOtpComponent } from './auth/sign-in/resend-otp/resend-otp.component';
import { ForgotPasswordComponent } from './auth/sign-in/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/sign-in/forgot-password/reset-password/reset-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssessmentComponent } from './dashboard/assessment/assessment.component';
import { TestResultComponent } from './dashboard/test-result/test-result.component';
import { TestCompletionComponent } from './dashboard/test-taking/test-completion/test-completion.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { authGuard } from './auth/auth.guard';
import { UnAuthorizedComponent } from './shared/un-authorized/un-authorized.component';
import { OverviewComponent } from './dashboard/overview/overview.component';
import { TestEnvironmentComponent } from './dashboard/test-taking/test-environment/test-environment.component';
import { TestInstructionsRouteComponent } from './dashboard/test-taking/test-instructions-route/test-instructions-route.component';

export const routes: Routes = [
  {
    path: '',
    component: SignUpComponent,
    title: 'Sign Up - Revisio',
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    title: 'Sign In - Revisio',
    children: [
      {
        path: 'resend-otp',
        component: ResendOtpComponent,
        title: 'Resend OTP - Revisio',
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        title: 'Forgot Password - Revisio',
        children: [
          {
            path: 'reset-password',
            component: ResetPasswordComponent,
            title: 'Reset Password - Revisio',
          },
        ],
      },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard - Revisio',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        component: OverviewComponent,
        title: 'Overview - Revisio',
      },
      {
        path: 'assessment',
        component: AssessmentComponent,
        title: 'Create Assessment - Revisio',
      },
      {
        path: 'test-result',
        component: TestResultComponent,
        title: 'Test Results - Revisio',
      },
    ],
  },
  // Test-taking routes (separate from dashboard for security)
  {
    path: 'test-instructions/:testConfigId',
    component: TestInstructionsRouteComponent,
    title: 'Test Instructions - Revisio',
    canActivate: [authGuard],
  },
  {
    path: 'test-environment/:testConfigId',
    component: TestEnvironmentComponent,
    title: 'Taking Test - Revisio',
    canActivate: [authGuard],
  },
  {
    path: 'test-completion',
    component: TestCompletionComponent,
    title: 'Test Completed - Revisio',
    canActivate: [authGuard],
  },
  {
    path: 'unauthorized',
    component: UnAuthorizedComponent,
    title: 'Unauthorized - Revisio',
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: '404 - Page Not Found - Revisio',
  },
];
