import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  private apiUrl = 'http://localhost:3000/api/logout'; // Replace with your backend logout URL
  //private apiUrl = 'https://taskmanager-backend-811345708928.europe-west10.run.app/api/logout'; // Replace with your backend logout URL


  constructor(private http: HttpClient) {}

  logout(token: string): Observable<any> {
    return this.http.post<any>(
      this.apiUrl,
      {}, // No body is required for the logout request
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }
    );
  }
}
