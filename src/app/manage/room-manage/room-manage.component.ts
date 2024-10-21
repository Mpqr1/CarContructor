import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../service/room.service';

@Component({
  selector: 'app-room-manage',
  templateUrl: './room-manage.component.html',
  styleUrls: ['./room-manage.component.css']
})
export class RoomManageComponent implements OnInit {
  rooms: any[] = [];  // สร้างตัวแปร rooms เพื่อเก็บข้อมูลห้องทั้งหมด
  selectedRoom: any = null;  // ตัวแปรสำหรับเก็บห้องที่ถูกเลือกแก้ไข
  newRoom = {
    room_name: '',
    room_desc: '',
    room_price: 0
  };  // สร้างตัวแปรสำหรับข้อมูลห้องใหม่

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    this.loadRooms();  // เรียกฟังก์ชันโหลดข้อมูลห้องเมื่อ component โหลด
  }

  // ฟังก์ชันสำหรับโหลดข้อมูลห้อง
  loadRooms() {
    this.roomService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data;
      },
      error: (err) => {
        console.error('Error loading rooms:', err);
      }
    });
  }

  // ฟังก์ชันสำหรับเพิ่มห้องใหม่
  addRoom() {
    this.roomService.addRoom(this.newRoom).subscribe({
      next: (response) => {
        console.log('Room added successfully', response);
        this.loadRooms();  // โหลดข้อมูลห้องใหม่หลังจากเพิ่ม
        this.newRoom = { room_name: '', room_desc: '', room_price: 0 };  // รีเซ็ตฟอร์มหลังจากเพิ่มห้องใหม่
      },
      error: (error) => {
        console.error('Error adding room:', error);
      }
    });
  }

  // ฟังก์ชันสำหรับแก้ไขห้อง
  editRoom(room: any) {
    this.selectedRoom = room;
  }

  // ฟังก์ชันสำหรับอัปเดตข้อมูลห้องที่ถูกแก้ไข
  updateRoom() {
    if (this.selectedRoom) {
      this.roomService.updateRoom(this.selectedRoom.room_id, this.selectedRoom).subscribe({
        next: () => {
          this.loadRooms();
          this.selectedRoom = null;  // รีเซ็ตหลังจากอัปเดตสำเร็จ
        },
        error: (err) => {
          console.error('Error updating room:', err);
        }
      });
    }
  }

  // ฟังก์ชันสำหรับลบห้อง
  deleteRoom(id: number) {
    this.roomService.deleteRoom(id).subscribe({
      next: () => {
        this.loadRooms();  // โหลดข้อมูลใหม่หลังจากลบห้อง
      },
      error: (err) => {
        console.error('Error deleting room:', err);
      }
    });
  }
}
