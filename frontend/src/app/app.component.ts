import { Component, OnInit } from '@angular/core';
import { AuthService } from './service/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  isAdmin: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.loadUser();
    this.authService.isAuthenticated().subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        const userRole = localStorage.getItem('user_role'); // ดึงค่า role จาก localStorage โดยตรง
        this.isAdmin = userRole === 'admin';
        console.log("Is Admin:", this.isAdmin); // ตรวจสอบค่า isAdmin ในคอนโซล
      } else {
        this.isAdmin = false;
      }
    });
  }
}
