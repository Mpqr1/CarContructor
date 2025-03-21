import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:3000/bookings';  // API URL for bookings

  constructor(private http: HttpClient) {}

  addBooking(bookingData: any): Observable<any> {
    return this.http.post(this.apiUrl, bookingData);
  }

  updateCarStock(carId: number, daysBooked: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-car-stock/${carId}`, { daysBooked });
  }

  getAllBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  deleteBooking(bookingId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${bookingId}`);
  }

  updateBookingStatus(bookingId: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update-status/${bookingId}`, { status });
  }

  getMyBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mybookings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }
  // BookingService - เพิ่มฟังก์ชัน updateBooking
updateBooking(bookingId: number, bookingData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/update-booking/${bookingId}`, bookingData);
}

}
