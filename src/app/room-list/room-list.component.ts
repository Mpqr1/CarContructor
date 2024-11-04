import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../service/room.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {
  availableRooms: any[] = [];
  filteredRooms: any[] = [];
  searchQuery: string = '';
  startDate: string = '';
  endDate: string = '';

  constructor(
    private roomService: RoomService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAvailableRooms();
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchQuery = params['search'];
        this.filterRooms();
      }
    });
  }

  loadAvailableRooms() {
    this.roomService.getAvailableRooms().subscribe({
      next: (rooms) => {
        console.log('Rooms data:', rooms); // ตรวจสอบข้อมูลที่ดึงมา
        this.availableRooms = rooms;
        this.filteredRooms = rooms; // เริ่มต้นด้วยการแสดงห้องพักทั้งหมด
        this.filterRooms(); // กรองห้องพักตาม searchQuery ถ้ามี
      },
      error: (err) => {
        console.error('Error loading available rooms:', err);
      }
    });
  }

  filterRooms() {
    this.filteredRooms = this.availableRooms.filter(room =>
      room.room_name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
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
      this.router.navigate(['/booking-detail'], { state: { bookingDetails } });
    } else {
      alert('Please select a start and end date');
    }
  }
}
