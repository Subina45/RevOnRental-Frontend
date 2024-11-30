import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
export interface Booking {
  id: number;                // Add this property
  vehiclePhoto: string;
  user: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [RouterLink,CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {
  selectedColor: string = '#28a745'; // Green for Confirmed
selectedTextColor: string = 'white'; // White text
 
  bookings: Booking[] = [
    {
      id: 1, // Add unique IDs here
      vehiclePhoto: 'assets/images/bicycle.png',
      user: 'kabita',
      startDate: new Date('2024-11-22'),
      endDate: new Date('2024-11-25'),
      totalPrice: 150.0,
      status: 'Confirmed'
    },
    {
      id: 2, // Add unique IDs here
      vehiclePhoto: 'assets/images/car.png',
      user: 'Jyoti',
      startDate: new Date('2024-11-20'),
      endDate: new Date('2024-11-23'),
      totalPrice: 200.0,
      status: 'Pending'
    },
    {
      id: 3, // Add unique IDs here
      vehiclePhoto: 'assets/images/bike.png',
      user: 'subina',
      startDate: new Date('2024-11-21'),
      endDate: new Date('2024-11-24'),
      totalPrice: 180.0,
      status: 'Cancelled'
    }
  ];
  
  // Function to handle accepting a booking
  acceptBooking(bookingId: number) {
    console.log("Accepted booking with ID:", bookingId);
    // Implement the logic to accept the booking
  }

  // Function to handle rejecting a booking
  rejectBooking(bookingId: number) {
    console.log("Rejected booking with ID:", bookingId);
    // Implement the logic to reject the booking
  }  

  markAsCompleted(bookingId: number): void {
    
    // Business user marks the booking as 'Completed'
    console.log(`Booking ID ${bookingId} marked as Completed`);
  
    
    // Optionally, make an API call to update the status on the server
    // this.bookingService.updateStatus(bookingId, newStatus).subscribe();
  }
  markAsRejected(bookingId: number) {
    // Your logic here, e.g., make an API call to mark the booking as rejected
    console.log('Booking marked as Rejected:', bookingId);
  }
  onStatusChange(booking: any) {
    console.log('Status changed to:', booking.status);
   
  }
}
