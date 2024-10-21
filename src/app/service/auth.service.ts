import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';  // ใช้ tap เพื่อตรวจสอบและเก็บ Token
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';  // URL ของ backend API

  constructor(
    private http: HttpClient, 
    @Inject(PLATFORM_ID) private platformId: any  // เช็คว่ารันในฝั่ง client หรือ server
  ) {}

  // ฟังก์ชันลงทะเบียน
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, userData);
  }

  // ฟังก์ชันเข้าสู่ระบบ
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, credentials).pipe(
      tap((response: any) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);  // เก็บ Token ใน localStorage
        }
      })
    );
  }

  // ฟังก์ชัน Logout
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');  // ลบ Token ออกจาก localStorage
    }
  }

  // ฟังก์ชันตรวจสอบการล็อกอิน
  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');  // ตรวจสอบว่ามี Token ใน localStorage หรือไม่
    }
    return false;
  }

  // ฟังก์ชันเพื่อดึงข้อมูลผู้ใช้ที่เข้าสู่ระบบ
  getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        return JSON.parse(atob(token.split('.')[1]));  // Decode payload ของ JWT token
      }
    }
    return null;
  }
}
