import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  user = {
    user_name: '',
    user_email: '',
    user_password: '',
    user_role: 'user',
    user_address: ''  // เพิ่ม user_address ที่นี่
  };
  confirmPassword: string = '';
  passwordMismatch: boolean = false;

  constructor(private authService: AuthService) {}

  register() {
    // Check if password and confirm password match
    if (this.user.user_password !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }
    this.passwordMismatch = false;

    // Proceed with registration if passwords match
    this.authService.register(this.user).subscribe({
      next: (response) => console.log('User registered successfully', response),
      error: (error) => console.error('Error during registration', error)
    });
  }
}

