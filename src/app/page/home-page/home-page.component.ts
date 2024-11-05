import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../../service/room.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  featuredRooms: any[] = [];

  constructor(private roomService: RoomService, private router: Router) {}

  ngOnInit(): void {
    this.loadFeaturedRooms();
  }

  loadFeaturedRooms() {
    this.roomService.getAvailableRooms().subscribe({
      next: (rooms) => {
        this.featuredRooms = rooms.slice(0, 6); // เลือกเฉพาะ 3 ห้องแรกสำหรับแสดงใน carousel
      },
      error: (err) => {
        console.error('Error loading featured rooms:', err);
      }
    });
  }

  viewRoomDetails(roomName: string) {
    this.router.navigate(['/room-list'], { queryParams: { search: roomName } });
  }
}
