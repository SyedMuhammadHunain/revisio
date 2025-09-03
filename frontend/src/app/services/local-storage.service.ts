import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  saveAccessToken(accessToken: string) {
    localStorage.setItem('access-token', accessToken);
  }

  getAccessToken() {}
}
