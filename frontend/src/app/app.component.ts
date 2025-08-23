import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { HeaderComponent } from "./header/header.component";

@Component({
  selector: 'app-root',
  imports: [SignUpComponent, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
}
