import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [RouterLink,RouterOutlet,CommonModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {
  bookings = [
    {
      vehiclePhoto: 'assets/images/bicycle.png',
      user: 'kabita',
      startDate: new Date('2024-11-22'),
      endDate: new Date('2024-11-25'),
      totalPrice: 150.0,
      status: 'Confirmed'
    },
    {
      vehiclePhoto: 'assets/images/car.png',
      user: 'Jyoti',
      startDate: new Date('2024-11-20'),
      endDate: new Date('2024-11-23'),
      totalPrice: 200.0,
      status: 'Pending'
    },
    {
      vehiclePhoto: 'assets/images/bike.png',
      user: 'subina',
      startDate: new Date('2024-11-21'),
      endDate: new Date('2024-11-24'),
      totalPrice: 180.0,
      status: 'Cancelled'
    }
  ];
}
