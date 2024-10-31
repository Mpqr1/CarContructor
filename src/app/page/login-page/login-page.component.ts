import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  credentials = {
    user_email: '',
    user_password: ''
  };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        if (response) {
          alert('Login successful!'); // แสดง alert เมื่อเข้าสู่ระบบสำเร็จ
          console.log('Login successful', response);
          this.router.navigate(['/home']); // นำทางไปยังหน้า home เมื่อสำเร็จ
        } else {
          this.errorMessage = 'Login failed. Please check your credentials.';
          alert(this.errorMessage); // แสดง alert เมื่อเข้าสู่ระบบไม่สำเร็จ
        }
      },
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.status === 404) {
          this.errorMessage = 'User not found. Please check your email.';
        } else {
          this.errorMessage = 'An error occurred during login. Please try again later.';
        }
        alert(this.errorMessage); // แสดง alert เมื่อเกิดข้อผิดพลาด
      }
    });
  }
}
