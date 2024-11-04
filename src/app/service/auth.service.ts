import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users'; // URL ของ backend API
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn()); // ใช้ BehaviorSubject เพื่อเก็บสถานะการล็อกอิน

  constructor(
    private http: HttpClient, 
    @Inject(PLATFORM_ID) private platformId: any // เช็คว่ารันในฝั่ง client หรือ server
  ) {}

  // ฟังก์ชันลงทะเบียน
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response) => console.log('Register successful:', response)),
      catchError(this.handleError('register'))
    );
  }

  // ฟังก์ชันเข้าสู่ระบบ
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (isPlatformBrowser(this.platformId) && response && response.token) {
          localStorage.setItem('token', response.token); // เก็บ Token ใน localStorage
          localStorage.setItem('user_name', response.username); // เก็บชื่อผู้ใช้
          localStorage.setItem('user_role', response.role); // เก็บ role ของผู้ใช้ใน localStorage
          this.isAuthenticatedSubject.next(true); // อัปเดตสถานะการล็อกอิน
        }
        console.log('Login successful:', response);
      }),
      catchError((error) => {
        console.error('login failed:', error);
        return throwError(() => error); // ส่งข้อผิดพลาดกลับ
      })
    );
}

  // ฟังก์ชัน Logout
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token'); // ลบ Token ออกจาก localStorage
      localStorage.removeItem('user_name'); // ลบชื่อผู้ใช้จาก localStorage
      this.isAuthenticatedSubject.next(false); // อัปเดตสถานะการล็อกอิน
    }
  }

  // ฟังก์ชันตรวจสอบการล็อกอิน
  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token'); // ตรวจสอบว่ามี Token ใน localStorage หรือไม่
    }
    return false;
  }

  // ฟังก์ชันเพื่อดึงสถานะการล็อกอินแบบ Observable
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // ฟังก์ชันดึงชื่อผู้ใช้ที่ล็อกอิน
  getUserName(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('user_name') : null;
  }

  // ฟังก์ชันดึงข้อมูลผู้ใช้จาก ID
  getUserInfo(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`).pipe(
      tap((response) => console.log('Fetched user info:', response)),
      catchError(this.handleError('getUserInfo'))
    );
  }

  // ฟังก์ชันเพื่อดึงข้อมูลผู้ใช้จาก Token ที่เก็บอยู่ใน localStorage
  getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          return JSON.parse(atob(token.split('.')[1])); // Decode payload ของ JWT token
        } catch (error) {
          console.error('Error parsing token:', error);
          return null;
        }
      }
    }
    return null;
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  // ฟังก์ชันจัดการ error
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`); // log error ลง console
      return of(result as T); // คืนค่าแบบที่ไม่ให้แอปหยุดทำงาน
    };
  }
  loadUser(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.isAuthenticatedSubject.next(true);
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }
  
}
