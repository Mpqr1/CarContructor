import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  credentials = {
    user_email: '',
    user_password: ''
  };

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        console.log('User role:', response.user_role);  // แสดง user_role
      },
      error: (error) => console.error('Error during login', error)
    });
  }
}