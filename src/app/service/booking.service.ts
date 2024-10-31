import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:3000/bookings';  // API URL for bookings

  constructor(private http: HttpClient) {}

  // Add a booking
  addBooking(bookingData: any): Observable<any> {
    return this.http.post(this.apiUrl, bookingData);
  }

  // Update room stock after booking
  updateRoomStock(roomId: number, daysBooked: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-room-stock/${roomId}`, { daysBooked });
  }

  getAllBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // ลบการจองโดย booking_id
  deleteBooking(bookingId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${bookingId}`);
  }
}
