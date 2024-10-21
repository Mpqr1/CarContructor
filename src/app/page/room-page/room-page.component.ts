import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../service/room.service';

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrl: './room-page.component.css'
})
export class RoomPageComponent implements OnInit {
  rooms: any[] = [];  // สร้างตัวแปรเก็บข้อมูลห้อง

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    this.loadRooms();  // เรียกฟังก์ชันโหลดข้อมูลห้องเมื่อ component โหลด
  }

  loadRooms() {
    this.roomService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data;  // เก็บข้อมูลห้องในตัวแปร rooms
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching rooms:', error);
      }
    });
  }

  // ตัวอย่างฟังก์ชันแก้ไขห้อง
  editRoom(roomId: number) {
    console.log(`Edit room with ID: ${roomId}`);
  }

  // ตัวอย่างฟังก์ชันลบห้อง
  deleteRoom(roomId: number) {
    console.log(`Delete room with ID: ${roomId}`);
    // เพิ่มการลบห้องด้วย service
    this.roomService.deleteRoom(roomId).subscribe({
      next: () => {
        console.log('Room deleted successfully');
        this.loadRooms();  // โหลดข้อมูลใหม่หลังจากลบห้อง
      },
      error: (error) => {
        console.error('Error deleting room:', error);
      }
    });
  }
}