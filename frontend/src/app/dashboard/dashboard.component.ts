import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { SideBarComponent } from './side-bar/side-bar.component';

@Component({
  selector: 'app-dashboard',
  imports: [SideBarComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  isCollapsed = true;

  toggleSidebar(state: boolean) {
    this.isCollapsed = state;
  }
}
