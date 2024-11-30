import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-usernotification',
  standalone: true,
  imports: [RouterOutlet,NgFor,CommonModule,FormsModule],
  templateUrl: './usernotification.component.html',
  styleUrl: './usernotification.component.css'
})
export class UsernotificationComponent {
  bookingRequests = [
    { userName: 'Tina', businessName: 'Best Rental', vehicleName:'Car', startDate: '2024-12-01', endDate: '2024-12-01' },
    { userName: 'John', businessName: 'Ram Rental', vehicleName:'Bike', startDate: '2024-12-05', endDate: '2024-12-06' },
    { userName: 'Alice', businessName: 'GoGreen Rental', vehicleName:'Bicycle', startDate: '2024-12-10', endDate: '2024-12-11' }
  ];

  constructor(
    private router: Router
  ){}
  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  stars = Array(5).fill(0); // Create an array for 5 stars
  rating = 0; // The currently selected rating
  hoverRatingValue = 0; // To track hover effect
  review = ''; // The review text

  setRating(value: number): void {
    this.rating = value; // Set the selected rating
  }

  hoverRating(value: number): void {
    this.hoverRatingValue = value; // Adjust stars on hover
    this.rating = this.hoverRatingValue || this.rating; // Keep current rating when hover ends
  }

  submitReview(): void {
    console.log('Rating:', this.rating);
    console.log('Review:', this.review);
    // Add logic to send data to the backend
  }

}
