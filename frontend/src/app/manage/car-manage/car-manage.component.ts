import { Component, OnInit } from '@angular/core';
import { CarService } from '../../service/car.service';

@Component({
  selector: 'app-car-manage',
  templateUrl: './car-manage.component.html',
  styleUrls: ['./car-manage.component.css']
})
export class CarManageComponent implements OnInit {
  cars: any[] = [];  // To store the list of cars
  selectedCar: any = null;  // For editing a specific car

  newCar = {
    car_name: '',
    car_desc: '',
    car_price: 0,
    car_stock: 0,
    car_image: '',
    car_status: true  // Default car_status to true (available)
  };

  constructor(private carService: CarService) { }

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars() {
    this.carService.getCars().subscribe({
      next: (data) => {
        this.cars = data;
      },
      error: (err) => {
        console.error('Error loading cars:', err);
      }
    });
  }

  addCar() {
    this.carService.addCar(this.newCar).subscribe({
      next: (response) => {
        console.log('Car added successfully', response);
        this.loadCars();
        this.newCar = { car_name: '', car_desc: '', car_price: 0, car_stock: 0, car_image: '', car_status: true };  // Reset form
      },
      error: (error) => {
        console.error('Error adding car:', error);
      }
    });
  }

  editCar(car: any) {
    this.selectedCar = { ...car };  // Clone the selected car object for editing
  }

  closeEditCarPopup() {
    this.selectedCar = null;  // ปิดป็อปอัพเมื่อกดปุ่มกากบาท
  }

  updateCar() {
    if (this.selectedCar) {
      this.carService.updateCar(this.selectedCar.car_id, this.selectedCar).subscribe({
        next: () => {
          this.loadCars();
          this.selectedCar = null;
        },
        error: (err) => {
          console.error('Error updating car:', err);
        }
      });
    }
  }

  deleteCar(id: number) {
    this.carService.deleteCar(id).subscribe({
      next: () => {
        this.loadCars();
      },
      error: (err) => {
        console.error('Error deleting car:', err);
      }
    });
  }
  
  
}
