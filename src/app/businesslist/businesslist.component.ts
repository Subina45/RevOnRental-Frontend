
import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { SearchService } from '../aservice/search.service';
import { AuthService } from '../aservice/auth.service';


interface Business {
  name: string;
  distance: string;
  rating: number;
  description: string;
  email: string;
  phoneNumber: number;
  imgUrl: string;
  thresholdPrice: number;
  price1: number;
}

@Component({
  selector: 'app-businesslist',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './businesslist.component.html',
  styleUrl: './businesslist.component.css'
})
export class BusinesslistComponent {
  
  businesses: Business[] = [];//list of available business
    // { name: 'A1 Rental', distance: '1.2 km', rating: 4.3, description: 'Affordable and reliable car rental service.', email: 'a1rental@gmail.com', phoneNumber: 987654321, imgUrl: 'assets/images/car.png', thresholdPrice: 2000, price1: 2000 },
    // { name: 'Flex Ride', distance: '1 km', rating: 4.2, description: 'Flexible and convenient rental options.', email: 'flexrental@gmail.com', phoneNumber: 987654321, imgUrl: 'assets/images/car.png', thresholdPrice: 2000, price1: 2000 },
    // { name: 'Go Fast Rental', distance: '2 km', rating: 4.3, description: 'Fast and easy car rentals.', email: 'gofastrental@gmail.com', phoneNumber: 987654321, imgUrl: 'assets/images/car.png', thresholdPrice: 2000, price1: 2000 },
    // { name: 'Best Rental', distance: '2.1 km', rating: 4.5, description: 'Best value rental service in the city.', email: 'bestrental@gmail.com', phoneNumber: 987654321, imgUrl: 'assets/images/car.png', thresholdPrice: 2000, price1: 2000 },
    // { name: 'Go Fast Rental', distance: '2 km', rating: 4.3, description: 'Fast and easy car rentals.', email: 'gofastrental@gmail.com', phoneNumber: 987654321, imgUrl: 'assets/images/car.png', thresholdPrice: 2000, price1: 2000 },
    // { name: 'Flex Ride', distance: '1 km', rating: 4.2, description: 'Flexible and convenient rental options.', email: 'flexrental@gmail.com', phoneNumber: 987654321, imgUrl: 'assets/images/car.png', thresholdPrice: 2000, price1: 2000 },
    // { name: 'A1 Rental', distance: '1.2 km', rating: 4.3, description: 'Affordable and reliable car rental service.', email: 'a1rental@gmail.com', phoneNumber: 987654321, imgUrl: 'assets/images/car.png', thresholdPrice: 2000, price1: 2000 },
    // { name: 'Best Rental', distance: '2.1 km', rating: 4.5, description: 'Best value rental service in the city.', email: 'bestrental@gmail.com', phoneNumber: 987654321, imgUrl: 'assets/images/car.png', thresholdPrice: 2000, price1: 2000 },
    // { name: 'A1 Rental', distance: '1.2 km', rating: 4.3, description: 'Affordable and reliable car rental service.', email: 'a1rental@gmail.com', phoneNumber: 987654321, imgUrl: 'assets/images/car.png', thresholdPrice: 2000, price1: 2000 },
 


  

  showModal = false;
  showPaymentModal = false;
  selectedBusiness: any;

  paymentMethod: string = '';

  constructor(
    private authService: AuthService,
    private searchService: SearchService
  ){
    this.businesses = searchService.getAvailableBusinesses(); // Fetch available businesses from service
  }


  ngOnInit(): void {
    // Subscribe to the availablebusinesses observable to get the list of businesses after a search
    this.searchService.availablebusinesses$.subscribe((businesses) => {
      this.businesses = businesses;
    });
  }

  viewMore(businessItem: any): void {
    // this.selectedBusiness = Business;
    // Fetch details of the selected business from the backend
    this.authService.getBusinessDetails(businessItem.id).subscribe(
      (details: any) => {
        this.selectedBusiness = details;

        // Get rental type from localStorage
        const rentalType = localStorage.getItem('rentalType');
        if (rentalType) {
          switch (rentalType) {
            case 'Hourly':
              this.selectedBusiness.displayedPrice = this.selectedBusiness.hourlyRate;
              break;
            case 'HalfDay':
              this.selectedBusiness.displayedPrice = this.selectedBusiness.halfDayRate;
              break;
            case 'FullDay':
              this.selectedBusiness.displayedPrice = this.selectedBusiness.fullDayRate;
              break;
            default:
              this.selectedBusiness.displayedPrice = 'N/A';
              break;
          }
        }

    this.showModal = true;
  },
  (error) => {
    console.error('Failed to fetch business details', error);
  }
);
  }

  closeModal(): void {
    this.showModal = false;
  }

  // for payment

  openPaymentModal(): void {
    this.showModal = false;
    this.showPaymentModal = true;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
  }

  selectPaymentMethod(method: string): void {
    this.paymentMethod = method;
  }

  processPayment(): void {
    if (this.paymentMethod === '') {
      alert('Please select a payment method.');
      return;
    }
    alert(`Payment processed using: ${this.paymentMethod}`);
    this.closePaymentModal();
  }

}