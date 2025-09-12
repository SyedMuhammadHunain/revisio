import { Component, Output, EventEmitter } from '@angular/core';

import { RouterLink } from '@angular/router';
import { ThemeToggleComponent } from '../../shared/theme-toggle/theme-toggle.component';
import { SignOutComponent } from "../../shared/sign-out/sign-out.component";

@Component({
  selector: 'app-side-bar',
  imports: [RouterLink, ThemeToggleComponent, SignOutComponent],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent {
  isCollapsed = true;

  @Output() toggle = new EventEmitter<boolean>();

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.toggle.emit(this.isCollapsed);
  }
}
