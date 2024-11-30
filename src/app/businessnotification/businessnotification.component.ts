import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-businessnotification',
  standalone: true,
  imports: [RouterOutlet,NgFor],
  templateUrl: './businessnotification.component.html',
  styleUrl: './businessnotification.component.css'
})
export class BusinessnotificationComponent {

  bookingRequests = [
    { userName: 'Tina', vehicleName:'Car', startDate: '2024-12-01', endDate: '2024-12-01' },
    { userName: 'John', vehicleName:'Bike', startDate: '2024-12-05', endDate: '2024-12-06' },
    { userName: 'Alice', vehicleName:'Bicycle', startDate: '2024-12-10', endDate: '2024-12-11' }
  ];

  constructor(
    private router: Router
  ){}
  navigateTo(path: string) {
    this.router.navigate([path]);
  }

}
