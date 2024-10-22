import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../service/room.service';

@Component({
  selector: 'app-room-manage',
  templateUrl: './room-manage.component.html',
  styleUrls: ['./room-manage.component.css']
})
export class RoomManageComponent implements OnInit {
  rooms: any[] = [];  // To store the list of rooms
  selectedRoom: any = null;  // For editing a specific room

  newRoom = {
    room_name: '',
    room_desc: '',
    room_price: 0,
    room_stock: 0,
    room_image: '',
    room_status: true  // Default room_status to true (available)
  };

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    this.loadRooms();
  }

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

  addRoom() {
    this.roomService.addRoom(this.newRoom).subscribe({
      next: (response) => {
        console.log('Room added successfully', response);
        this.loadRooms();
        this.newRoom = { room_name: '', room_desc: '', room_price: 0, room_stock: 0, room_image: '', room_status: true };  // Reset form
      },
      error: (error) => {
        console.error('Error adding room:', error);
      }
    });
  }

  editRoom(room: any) {
    this.selectedRoom = { ...room };  // Clone the selected room object for editing
  }

  updateRoom() {
    if (this.selectedRoom) {
      this.roomService.updateRoom(this.selectedRoom.room_id, this.selectedRoom).subscribe({
        next: () => {
          this.loadRooms();
          this.selectedRoom = null;
        },
        error: (err) => {
          console.error('Error updating room:', err);
        }
      });
    }
  }

  deleteRoom(id: number) {
    this.roomService.deleteRoom(id).subscribe({
      next: () => {
        this.loadRooms();
      },
      error: (err) => {
        console.error('Error deleting room:', err);
      }
    });
  }
}