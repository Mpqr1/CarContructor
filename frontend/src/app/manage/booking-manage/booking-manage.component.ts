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
  isEditing: boolean = false;
  startDate: string = '';
  endDate: string = '';
  carName: string = '';
  customerName: string = ''; // เพิ่มตัวแปรสำหรับค้นหาชื่อลูกค้า
  selectedStatus: string = ''; // ตัวแปรสำหรับสถานะที่เลือก
  editData: any = {};

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getAllBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.applyFilters(); // เรียกใช้ applyFilters หลังจากโหลดข้อมูล
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
      }
    });
  }

  // ฟังก์ชันการกรองทั้งหมด
  applyFilters() {
    this.filteredBookings = this.bookings.filter(booking => {
      const bookingStart = new Date(booking.start_date);
      const bookingEnd = new Date(booking.end_date);
      const start = this.startDate ? new Date(this.startDate) : null;
      const end = this.endDate ? new Date(this.endDate) : null;

      return (
        (!start || bookingStart >= start) &&
        (!end || bookingEnd <= end) &&
        (this.selectedStatus === '' || booking.booking_status === this.selectedStatus) &&
        (!this.carName || booking.car_name.toLowerCase().includes(this.carName.toLowerCase())) &&
        (!this.customerName || booking.user_name.toLowerCase().includes(this.customerName.toLowerCase())) // กรองตามชื่อผู้ใช้
      );
    });
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    this.applyFilters();
  }

  resetFilter() {
    this.selectedStatus = '';
    this.carName = '';
    this.customerName = ''; // รีเซ็ตชื่อลูกค้า
    this.startDate = '';
    this.endDate = '';
    this.applyFilters();
  }

  toggleDetails(bookingId: number) {
    this.selectedBookingId = this.selectedBookingId === bookingId ? null : bookingId;
    this.isEditing = false;
  }

  enableEdit(booking: any) {
    this.isEditing = true;
    this.editData = {
      booking_id: booking.booking_id,
      user_name: booking.user_name,
      car_id: booking.car_id,
      total_price: booking.total_price,
      start_date: booking.start_date,
      end_date: booking.end_date
    };
  }

  saveBooking() {
    if (this.editData) {
      this.bookingService.updateBooking(this.editData.booking_id, this.editData).subscribe({
        next: () => {
          this.loadBookings();
          this.isEditing = false;
        },
        error: (error) => {
          console.error('Error updating booking:', error);
        }
      });
    }
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
