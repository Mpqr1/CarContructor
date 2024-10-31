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
  user: any = {}; // ตัวแปรเก็บข้อมูลผู้ใช้
  totalDays: number = 0;
  totalPrice: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    // รับข้อมูล bookingDetails จาก navigation state
    this.bookingDetails = history.state.bookingDetails;

    // ตรวจสอบว่ามีข้อมูลการจองหรือไม่
    if (this.bookingDetails) {
      const startDate = new Date(this.bookingDetails.startDate);
      const endDate = new Date(this.bookingDetails.endDate);
      this.totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)); // คำนวณจำนวนวันที่จอง
      this.totalPrice = this.totalDays * this.bookingDetails.room.room_price; // คำนวณราคารวม
    }

    // ดึง user ID จาก token เพื่อใช้ใน getUserInfo
    const tokenUser = this.authService.getUser();
    if (tokenUser && tokenUser.id) {
      const userId = tokenUser.id;

      // เรียกใช้ getUserInfo เพื่อดึงข้อมูลผู้ใช้จาก backend
      this.authService.getUserInfo(userId).subscribe({
        next: (userData) => {
          this.user = userData; // ควรจะได้ {user_id, user_name, user_email}
          console.log('Fetched User info from backend:', this.user);
        },
        error: (err) => {
          console.error('Error fetching user info:', err);
        }
      });
    } else {
      console.error('User ID not found in token.');
    }
  }

  // ฟังก์ชันยืนยันการจองห้อง
  confirmBooking() {
    console.log('User info before confirming booking:', this.user); // ตรวจสอบข้อมูล user ก่อนยืนยันการจอง

    const bookingData = {
      room_id: this.bookingDetails.room.room_id,
      user_id: this.user.user_id, // ตรวจสอบว่าใช้ "user_id" จาก backend ที่ดึงมา
      startDate: this.bookingDetails.startDate,
      endDate: this.bookingDetails.endDate,
      totalDays: this.totalDays,
      totalPrice: this.totalPrice
    };

    this.bookingService.addBooking(bookingData).subscribe({
      next: (response) => {
        console.log('Booking confirmed', response);
        this.reduceRoomStock(this.bookingDetails.room.room_id, this.totalDays);
        this.router.navigate(['/booking-success']);
      },
      error: (error) => {
        console.error('Error confirming booking:', error);
      }
    });
  }

  // ฟังก์ชันลดจำนวน stock ห้องหลังการจอง
  reduceRoomStock(roomId: number, totalDays: number) {
    this.bookingService.updateRoomStock(roomId, totalDays).subscribe({
      next: (response) => console.log('Room stock updated successfully', response),
      error: (error) => console.error('Error updating room stock:', error)
    });
  }
}
