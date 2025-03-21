import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarService } from '../../service/car.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  featuredCars: any[] = [];

  constructor(private carService: CarService, private router: Router) {}

  ngOnInit(): void {
    this.loadFeaturedCars();
  }

  loadFeaturedCars() {
    this.carService.getAvailableCars().subscribe({
      next: (cars) => {
        this.featuredCars = cars.slice(0, 6); // เลือกเฉพาะ 3 ห้องแรกสำหรับแสดงใน carousel
      },
      error: (err) => {
        console.error('Error loading featured cars:', err);
      }
    });
  }

  viewCarDetails(carName: string) {
    this.router.navigate(['/car-list'], { queryParams: { search: carName } });
  }
}
