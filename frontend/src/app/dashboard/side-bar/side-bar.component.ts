import { Component, Output, EventEmitter, inject } from '@angular/core';

import { RouterLink } from '@angular/router';
import { ThemeToggleComponent } from '../../shared/theme-toggle/theme-toggle.component';
import { SignOutComponent } from "../../shared/sign-out/sign-out.component";
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-side-bar',
  imports: [RouterLink, ThemeToggleComponent, SignOutComponent],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent {
  private localStorage = inject(LocalStorageService);
  isCollapsed = true;

  @Output() toggle = new EventEmitter<boolean>();

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.toggle.emit(this.isCollapsed);
  }
}
