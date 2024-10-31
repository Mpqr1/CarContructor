import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';  // ใช้ tap เพื่อตรวจสอบและเก็บ Token
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';  // URL ของ backend API

  constructor(
    private http: HttpClient, 
    @Inject(PLATFORM_ID) private platformId: any  // เช็คว่ารันในฝั่ง client หรือ server
  ) {}

  // ฟังก์ชันลงทะเบียน
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, userData).pipe(
      catchError(this.handleError('register', []))  // จัดการ error
    );
  }

  // ฟังก์ชันเข้าสู่ระบบ
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, credentials).pipe(
      tap((response: any) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);  // เก็บ Token ใน localStorage
        }
      }),
      catchError(this.handleError('login', []))  // จัดการ error
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

  getUserInfo(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }
  
  // ฟังก์ชันเพื่อดึงข้อมูลผู้ใช้ที่เข้าสู่ระบบ
  getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          return JSON.parse(atob(token.split('.')[1]));  // Decode payload ของ JWT token
        } catch (error) {
          console.error('Error parsing token:', error);
          return null;
        }
      }
    }
    return null;
  }

  // ฟังก์ชันจัดการ error
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);  // log error ลง console
      return of(result as T);  // คืนค่าแบบที่ไม่ให้แอปหยุดทำงาน
    };
  }
}
