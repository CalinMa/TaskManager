import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  twoFactorForm: FormGroup;
  isLoading = false;
  isTwoFactorStage = false;
  userId: string | null = null;

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.twoFactorForm = this.fb.group({
      twoFactorCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]], // 6-digit code
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const loginData = this.loginForm.value;

    this.loginService.login(loginData).subscribe({
      next: (response: any) => {
        console.log('Login successful, awaiting 2FA:', response);
        localStorage.setItem('customerId', response.userId);
        this.isTwoFactorStage = true;
        this.userId = response.userId;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Login failed. Please check your credentials.');
        this.isLoading = false;
      },
    });
  }

  onVerify2FA(): void {
    if (this.twoFactorForm.invalid || !this.userId) return;
  
    this.isLoading = true;
    const twoFactorData = {
      userId: this.userId!, // Non-null assertion
      twoFactorCode: this.twoFactorForm.value.twoFactorCode,
    };
  
    this.loginService.verify2FA(twoFactorData).subscribe({
      next: (response: any) => {
        console.log('2FA verification successful:', response);
        // alert('Login successful!');
        localStorage.setItem('authToken', response.token);
        this.isLoading = false;
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        console.error('2FA verification failed:', err);
        alert('Invalid 2FA code. Please try again.');
        this.isLoading = false;
      },
    });
  }
  register(): void{
    this.router.navigate(['/register']);
  }
}
