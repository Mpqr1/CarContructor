import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = 'http://localhost:3000/cars';

  constructor(private http: HttpClient) { }
  
// Get available cars (car_status = true)
getAvailableCars(): Observable<any> {
  return this.http.get(`${this.apiUrl}/available`);
}

  // ดึงข้อมูลห้องทั้งหมด
  getCars(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // เพิ่มข้อมูลห้อง
  addCar(carData: any): Observable<any> {
    return this.http.post(this.apiUrl, carData).pipe(
      catchError(this.handleError)
    );
  }

  // ดึงข้อมูลห้องเฉพาะ
  getCarById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // อัปเดตข้อมูลห้อง
  updateCar(id: number, carData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, carData).pipe(
      catchError(this.handleError)
    );
  }

  // ลบข้อมูลห้อง
  deleteCar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ฟังก์ชันจัดการ error
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server returned code: ${error.status}, message: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
