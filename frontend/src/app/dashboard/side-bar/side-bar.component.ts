import { Component, Output, EventEmitter } from '@angular/core';

import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent {
  isCollapsed = true;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
