import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
interface Vehicle {
  name: string;
  imgUrl: string;

  hourlyRate: number; // Added hourly rate
  halfDayRate: number; // Added half-day rate
  fullDayRate: number; // Added full-day rate
}

@Component({
  selector: 'app-getbusinessdetail',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './getbusinessdetail.component.html',
  styleUrls: ['./getbusinessdetail.component.css']
})
export class GetbusinessdetailComponent {
  vehicles: Vehicle[] = [
    {
      name: 'A1 Rental',
      imgUrl: 'assets/images/car.png',
      hourlyRate: 500,
      halfDayRate: 1500,
      fullDayRate: 3000
    },
    {
      name: 'Flex Ride',
      imgUrl: 'assets/images/car.png',
 hourlyRate: 600,
      halfDayRate: 1600,
      fullDayRate: 3200
    },
    {
     
      imgUrl: 'assets/images/car.png',
      name: 'B2 Ride',
      hourlyRate: 550,
      halfDayRate: 1550,
      fullDayRate: 3100
    }
  ];

  selectedVehicle?: Vehicle;
  selectVehicle(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
  }
  
}