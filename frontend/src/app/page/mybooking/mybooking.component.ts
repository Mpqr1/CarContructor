import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../service/booking.service';
import { AuthService } from '../../service/auth.service';


@Component({
  selector: 'app-mybooking',
  templateUrl: './mybooking.component.html',
  styleUrl: './mybooking.component.css'
})
export class MybookingComponent implements OnInit {
  bookings: any[] = [];
  filteredBookings: any[] = [];
  selectedBookingId: number | null = null;
  startDate: string = '';
  endDate: string = '';

  constructor(private bookingService: BookingService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadMyBookings();
  }

  loadMyBookings() {
    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        console.log('User bookings:', data);
        this.bookings = data;
        this.filteredBookings = data;
      },
      error: (error) => {
        console.error('Error loading user bookings:', error);
      }
    });
  }

  filterBookings() {
    this.filteredBookings = this.bookings.filter(booking => {
      const bookingStart = new Date(booking.start_date);
      const bookingEnd = new Date(booking.end_date);
      const start = this.startDate ? new Date(this.startDate) : null;
      const end = this.endDate ? new Date(this.endDate) : null;

      return (!start || bookingStart >= start) && (!end || bookingEnd <= end);
    });
  }

  toggleDetails(bookingId: number) {
    this.selectedBookingId = this.selectedBookingId === bookingId ? null : bookingId;
  }
}