
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface Booking {
  BusinessName: string;
  Model: string;
  Brand: string;
  StartDate: string;
  EndDate: string;

  VehicleId: string;
  imgUrl: string;
  TotalPrice: number;
  CreatedDate: string;
}

@Component({
  selector: 'app-userbookinghistory',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './userbookinghistory.component.html',
  styleUrl: './userbookinghistory.component.css'
})
export class UserbookinghistoryComponent {

  bookings: Booking[] = [
    {
      BusinessName: "Elite Car Rentals",
      Model: "Accord",
      Brand: "Honda",
      StartDate: "2024-12-10",
      EndDate: "2024-12-15",
      imgUrl: "../assets/images/bike1.png",
      VehicleId: "VH123",
      TotalPrice: 5000,
      CreatedDate: "2024-11-25"
    },
    {
      BusinessName: "Smart Rentals",
      Model: "Accord",
      Brand: "Honda",
      StartDate: "2024-12-10",
      EndDate: "2024-12-15",
      imgUrl: "../assets/images/car.png",
      VehicleId: "VH123",
      TotalPrice: 1000,
      CreatedDate: "2024-11-25"
    },
    {
      BusinessName: "Ridify Business",
      Model: "Accord",
      Brand: "Honda",
      StartDate: "2024-12-10",
      EndDate: "2024-12-15",
      imgUrl: "../assets/images/cycle.png",
      VehicleId: "VH123",
      TotalPrice: 200,
      CreatedDate: "2024-11-25"
    },

  ];

  
  

  constructor() { }

  ngOnInit(): void {
    // Fetch bookings data if necessary
  }
}
