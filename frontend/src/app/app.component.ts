import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';
import { MessageComponent } from './shared/message/message.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    MessageComponent,
    RouterOutlet,
    CommonModule,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
