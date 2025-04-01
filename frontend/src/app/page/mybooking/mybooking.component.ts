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
  selectedOption: string = '';

  constructor(private bookingService: BookingService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadMyBookings();
  }

  loadMyBookings() {
    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        console.log('User bookings:', data);
        this.bookings = data;
        this.filteredBookings = this.bookings.sort((a, b) => b.booking_id - a.booking_id);
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

  paymentMethods: { [bookingId: number]: string } = {}; // เก็บวิธีชำระของแต่ละ booking

confirmPayment(bookingId: number) {
  const method = this.paymentMethods[bookingId] || 'credit'; // ค่าเริ่มต้น

  const msg = method === 'credit'
    ? 'คุณต้องการชำระเงินด้วยบัตรเครดิต/เดบิต ใช่หรือไม่?'
    : 'คุณต้องการชำระเงินที่ศูนย์ ใช่หรือไม่?';

  if (confirm(msg)) {
    this.bookingService.updateBookingStatus(bookingId, 'Paid').subscribe({
      next: () => {
        alert('✅ ชำระเงินสำเร็จ! สถานะถูกเปลี่ยนเป็น Paid แล้ว');
        this.loadMyBookings(); // โหลดใหม่ให้สถานะอัปเดต
      },
      error: (err) => {
        console.error('❌ Error updating booking status:', err);
        alert('เกิดข้อผิดพลาดในการชำระเงิน');
      }
    });
  }
}

cancelBooking(bookingId: number) {
  if (confirm('คุณต้องการยกเลิกการจองนี้ใช่หรือไม่?')) {
    this.bookingService.deleteBooking(bookingId).subscribe({
      next: () => {
        alert('✅ การจองถูกยกเลิกแล้ว');
        this.loadMyBookings();
      },
      error: (err) => {
        console.error('❌ Error cancelling booking:', err);
        alert('เกิดข้อผิดพลาดในการยกเลิกการจอง');
      }
    });
  }
}

}

