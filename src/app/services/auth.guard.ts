import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root', // Makes this guard available application-wide
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Check if the user has a valid auth token in localStorage
    const token = localStorage.getItem('authToken');

    if (token) {
      // User is authenticated, allow access
      return true;
    } else {
      // User is not authenticated, redirect to the login page
      this.router.navigate(['/login']);
      return false;
    }
  }
}
