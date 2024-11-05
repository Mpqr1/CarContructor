import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../service/booking.service';

@Component({
  selector: 'app-booking-manage',
  templateUrl: './booking-manage.component.html',
  styleUrls: ['./booking-manage.component.css']
})
export class BookingManageComponent implements OnInit {
  bookings: any[] = [];
  filteredBookings: any[] = [];
  selectedBookingId: number | null = null;
  startDate: string = '';
  endDate: string = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getAllBookings().subscribe({
      next: (data) => {
        console.log('API Response:', data); // Check the data
        this.bookings = data;
        this.filteredBookings = data;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
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

  updateBookingStatus(bookingId: number, status: string) {
    this.bookingService.updateBookingStatus(bookingId, status).subscribe({
      next: () => {
        this.loadBookings();
      },
      error: (error) => {
        console.error('Error updating booking status:', error);
      }
    });
  }

  deleteBooking(bookingId: number) {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.bookingService.deleteBooking(bookingId).subscribe({
        next: () => {
          this.loadBookings();
        },
        error: (error) => {
          console.error('Error deleting booking:', error);
        }
      });
    }
  }
}
