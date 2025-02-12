import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private loginUrl = 'http://localhost:3000/api/auth/login'; // API endpoint for login
  private verify2FAUrl = 'http://localhost:3000/api/auth/verify-2fa'; // API endpoint for 2FA verification

  //private loginUrl = 'https://taskmanager-backend-811345708928.europe-west10.run.app/api/auth/login'; // API endpoint for login
  //private verify2FAUrl = 'https://taskmanager-backend-811345708928.europe-west10.run.app/api/auth/verify-2fa'; // API endpoint for 2FA verification

  constructor(private http: HttpClient) {}

  // Login request
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(this.loginUrl, credentials);
  }

  // 2FA Verification request
  verify2FA(data: { userId: string; twoFactorCode: string }): Observable<any> {
    return this.http.post(this.verify2FAUrl, data);
  }
}
