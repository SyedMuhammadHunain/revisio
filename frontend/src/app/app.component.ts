import { Component } from '@angular/core';
import { SignUpComponent } from "./sign-up/sign-up.component";
import { SideHeaderComponent } from "./side-header/side-header.component";

@Component({
  selector: 'app-root',
  imports: [SignUpComponent, SideHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
