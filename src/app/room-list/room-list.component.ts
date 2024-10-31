import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../service/room.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {
  availableRooms: any[] = [];
  startDate: string = '';
  endDate: string = '';

  constructor(private roomService: RoomService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadAvailableRooms();
  }

  loadAvailableRooms() {
    this.roomService.getAvailableRooms().subscribe({
      next: (rooms) => {
        console.log('Rooms data:', rooms); // ตรวจสอบข้อมูลที่ดึงมา
        this.availableRooms = rooms;
      },
      error: (err) => {
        console.error('Error loading available rooms:', err);
      }
    });
  }

  bookRoom(room: any) {
    if (this.startDate && this.endDate) {
      const bookingDetails = {
        room: room,
        startDate: this.startDate,
        endDate: this.endDate,
        user: this.authService.getUser()
      };
      console.log('Booking Details:', bookingDetails);
      
      // Navigate to booking-detail page with booking details
      this.router.navigate(['/booking-detail'], { state: { bookingDetails } });
    } else {
      alert('Please select a start and end date');
    }
  }
}
