import { Component } from '@angular/core';

import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { SideHeaderComponent } from './side-header/side-header.component';
import { HeaderComponent } from './header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [SignUpComponent, SideHeaderComponent, HeaderComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
}
