import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../aservice/auth.service';
import { PaymentService } from '../aservice/payment.service';

interface BookingRequest {
  id: number; // Add if available in your data
  message: string;
  businessName: string;
  userName: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  misc: {
    user: {
      id: number;
      name: string;
    };
    business: {
      id: number;
      name: string;
    };
    vehicle: {
      id: number;
      name: string;
    };
    rental: {
      id: number;
    };
  };
}
@Component({
  selector: 'app-usernotification',
  standalone: true,
  imports: [RouterOutlet, NgFor, CommonModule, FormsModule],
  templateUrl: './usernotification.component.html',
  styleUrl: './usernotification.component.css',
})
export class UsernotificationComponent {
  bookingRequests: BookingRequest[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private paymentService:PaymentService,
    private route: ActivatedRoute,

  ) {
    this.route.queryParams.subscribe((params) => {
      debugger;
      if(params['pidx']){
        const callBack = {
          pidx: params['pidx'],
          
      };
        window.open(`https://test-pay.khalti.com/?pidx=${params['pidx']}`);
        
      }
      
  });
  }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.authService.getUserNotifications(userId).subscribe(
      (bookingRequests: BookingRequest[]) => {
        this.bookingRequests = bookingRequests;
      },
      (error) => {
        console.error('Error fetching booking requests:', error);
      }
    );
  }

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

  initiatePayment() {
   
    const paymentDetails = {
        returnUrl: "http://localhost:4200/",
        websiteUrl: "https://example.com/",
        amount: "7000",
        purchaseRentalId: "16",
        userId:1043,
        vehicleId:27,
        businessId:12
    };
this.paymentService.initiatePaymentApi(paymentDetails).subscribe((res:any)=>{
  debugger;
  if(res){
    if(res.payment_url){
      window.open(res.payment_url, "_blank"); // Open the payment URL
    }
  }
})

}
}
