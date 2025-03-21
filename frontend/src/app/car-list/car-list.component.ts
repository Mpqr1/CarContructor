import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../service/car.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {
  availableCars: any[] = [];
  filteredCars: any[] = [];
  searchQuery: string = '';
  startDate: string = '';
  endDate: string = '';

  constructor(
    private carService: CarService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAvailableCars();
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchQuery = params['search'];
        this.filterCars();
      }
    });
  }

  loadAvailableCars() {
    this.carService.getAvailableCars().subscribe({
      next: (cars) => {
        console.log('Cars data:', cars); // ตรวจสอบข้อมูลที่ดึงมา
        this.availableCars = cars;
        this.filteredCars = cars; // เริ่มต้นด้วยการแสดงห้องพักทั้งหมด
        this.filterCars(); // กรองห้องพักตาม searchQuery ถ้ามี
      },
      error: (err) => {
        console.error('Error loading available cars:', err);
      }
    });
  }

  filterCars() {
    this.filteredCars = this.availableCars.filter(car =>
      car.car_name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  bookCar(car: any) {
    if (this.startDate && this.endDate) {
      const bookingDetails = {
        car: car,
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
