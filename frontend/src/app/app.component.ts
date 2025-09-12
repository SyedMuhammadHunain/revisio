import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';

import { MessageComponent } from './shared/message/message.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MessageComponent,
    RouterOutlet,
    CommonModule,
    LoaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  loading = false;
  header = true;

  onChildActivate(component: any) {
    if (component instanceof SignUpComponent) {
      component.loading.subscribe((loadingState: boolean) => {
        this.loading = loadingState;
      });
    }
  }
}
