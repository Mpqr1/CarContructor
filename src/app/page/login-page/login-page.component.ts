import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'] // แก้จาก 'styleUrl' เป็น 'styleUrls'
})
export class LoginPageComponent {
  credentials = {
    user_email: '',
    user_password: ''
  };
  errorMessage: string = '';  // ตัวแปรเก็บข้อความ error

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        console.log('User role:', response.user_role);
        this.errorMessage = ''; // เคลียร์ error message ถ้า login สำเร็จ
      },
      error: (error) => {
        console.error('Error during login', error);
        if (error.status === 401) {  // เช็คสถานะ 401 Unauthorized
          this.errorMessage = 'Invalid email or password. Please try again.'; // กำหนดข้อความแจ้งเตือนเมื่อ login ไม่สำเร็จ
        } else {
          this.errorMessage = 'An error occurred during login. Please try again later.';
        }
      }
    });
  }
}
