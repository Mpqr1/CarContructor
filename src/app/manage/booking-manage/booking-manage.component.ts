import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../service/booking.service';

@Component({
  selector: 'app-booking-manage',
  templateUrl: './booking-manage.component.html',
  styleUrls: ['./booking-manage.component.css']
})
export class BookingManageComponent implements OnInit {
  bookings: any[] = []; // เก็บข้อมูลการจองทั้งหมด

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getAllBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        console.log('Bookings:', this.bookings);
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
      }
    });
  }

  // Optional: ฟังก์ชันลบการจอง
  deleteBooking(bookingId: number) {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.bookingService.deleteBooking(bookingId).subscribe({
        next: () => {
          this.bookings = this.bookings.filter(booking => booking.booking_id !== bookingId);
          console.log('Booking deleted');
        },
        error: (error) => {
          console.error('Error deleting booking:', error);
        }
      });
    }
  }
}
