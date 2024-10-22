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
    room_image: '' // Room image URL
  };  // To store the details of a new room being added

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    this.loadRooms();  // Load the rooms when the component initializes
  }

  // Function to load the rooms
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

  // Function to add a new room
  addRoom() {
    this.roomService.addRoom(this.newRoom).subscribe({
      next: (response) => {
        console.log('Room added successfully', response);
        this.loadRooms();  // Reload the list of rooms
        this.newRoom = { room_name: '', room_desc: '', room_price: 0, room_stock: 0, room_image: '' };  // Reset form
      },
      error: (error) => {
        console.error('Error adding room:', error);
      }
    });
  }

  // Function to edit an existing room
  editRoom(room: any) {
    this.selectedRoom = { ...room };  // Clone the selected room object for editing
  }

  // Function to update the room
  updateRoom() {
    if (this.selectedRoom) {
      this.roomService.updateRoom(this.selectedRoom.room_id, this.selectedRoom).subscribe({
        next: () => {
          this.loadRooms();  // Reload the room list after updating
          this.selectedRoom = null;  // Clear the selected room
        },
        error: (err) => {
          console.error('Error updating room:', err);
        }
      });
    }
  }

  // Function to delete a room
  deleteRoom(id: number) {
    this.roomService.deleteRoom(id).subscribe({
      next: () => {
        this.loadRooms();  // Reload the list of rooms after deleting
      },
      error: (err) => {
        console.error('Error deleting room:', err);
      }
    });
  }
}
