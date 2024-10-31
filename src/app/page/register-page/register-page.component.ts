import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  user = {
    user_name: '',
    user_email: '',
    user_password: '',
    user_role: 'user'  // ค่าเริ่มต้นคือ 'user'
  };

  constructor(private authService: AuthService) {}

  register() {
    console.log(this.user);
    this.authService.register(this.user).subscribe({
      next: (response) => console.log('User registered successfully', response),
      error: (error) => console.error('Error during registration', error)
    });
  }
}
