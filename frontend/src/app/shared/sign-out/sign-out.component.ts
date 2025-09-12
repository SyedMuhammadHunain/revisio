import { Component, inject } from '@angular/core';

import { LocalStorageService } from '../../services/local-storage.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-out',
  imports: [],
  templateUrl: './sign-out.component.html',
  styleUrl: './sign-out.component.css',
})
export class SignOutComponent {
  private localStorage = inject(LocalStorageService);
  private router = inject(Router);

  signOut() {
    this.localStorage.clearAccessToken();
    this.router.navigate(['/sign-in']);
  }
}
