import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly ACCESS_TOKEN_KEY = 'access-token';

  saveAccessToken(accessToken: string): void {
    try {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    } catch (error) {
      console.error('Failed to save access token:', error);
    }
  }

  getAccessToken(): string | null {
    try {
      const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      if (token) {
        // Validate token format
        const parts = token.split('.');
        if (parts.length === 3) {
          return token;
        } else {
          console.warn('Invalid token format found, clearing token');
          this.clearAccessToken();
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  }

  clearAccessToken(): void {
    try {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to clear access token:', error);
    }
  }

  isTokenValid(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < currentTime) {
        this.clearAccessToken();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      this.clearAccessToken();
      return false;
    }
  }

  getUserInfoFromToken(): any {
    const token = this.getAccessToken();
    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.sub,
        email: payload.email,
        exp: payload.exp,
        iat: payload.iat,
      };
    } catch (error) {
      console.error('Error parsing token payload:', error);
      return null;
    }
  }
}
