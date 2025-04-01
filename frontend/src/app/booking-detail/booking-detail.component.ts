import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../service/booking.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css']
})
export class BookingDetailComponent implements OnInit {
  bookingDetails: any;
  user: any = {}; // User details
  totalDays: number = 0;
  totalPrice: number = 0;

  // กำหนด quoteForm ที่จะใช้กับ ngModel
  quoteForm: any = {
    country: '',
    contact: '',
    company: '',
    phone: '',
    additional: '',
    agree: false
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.bookingDetails = history.state.bookingDetails;

    if (this.bookingDetails) {
      const startDate = new Date(this.bookingDetails.startDate);
      const endDate = new Date(this.bookingDetails.endDate);
      this.totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      this.totalPrice = this.totalDays * this.bookingDetails.car.car_price;
    }

    const tokenUser = this.authService.getUser();
    if (tokenUser && tokenUser.id) {
      const userId = tokenUser.id;
      this.authService.getUserInfo(userId).subscribe({
        next: (userData) => {
          this.user = userData;
        },
        error: (err) => {
          console.error('Error fetching user info:', err);
        }
      });
    } else {
      console.error('User ID not found in token.');
    }
  }

  confirmBooking() {
    if (!this.user.user_id) {
      console.error('User is not logged in');
      return;
    }

    const bookingData = {
      car_id: this.bookingDetails.car.car_id,
      user_id: this.user.user_id,
      startDate: this.bookingDetails.startDate,
      endDate: this.bookingDetails.endDate,
      totalDays: this.totalDays,
      totalPrice: this.totalPrice,
      country: this.quoteForm.country,
      contact: this.quoteForm.contact,
      company: this.quoteForm.company,
      phone: this.quoteForm.phone,
      additional: this.quoteForm.additional,
      bookingStatus: 'booking'
    };
    console.log('📦 BookingData:', bookingData);

    this.bookingService.addBooking(bookingData).subscribe({
      next: (response) => {
        console.log('Booking confirmed successfully', response);
        this.reduceCarStock(this.bookingDetails.car.car_id, this.totalDays);
        this.router.navigate(['/mybooking']);
      },
      error: (error) => {
        console.error('Error confirming booking:', error);
      }
    });
  }

  reduceCarStock(carId: number, totalDays: number) {
    this.bookingService.updateCarStock(carId, totalDays).subscribe({
      next: (response) => console.log('Car stock updated successfully', response),
      error: (error) => console.error('Error updating car stock:', error)
    });
  }
}
