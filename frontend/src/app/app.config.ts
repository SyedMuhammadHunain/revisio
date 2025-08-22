import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { NgHcaptchaModule } from 'ng-hcaptcha';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),

    // hCaptcha
    importProvidersFrom(
      NgHcaptchaModule.forRoot({
        siteKey: '186a3e30-f2d2-4766-aeae-1e9edf545104',
        languageCode: 'en',
      })
    ),
  ],
};
