
import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';


interface Vehicle {
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
  
  vehicles: Vehicle[] = [
    { name: 'A1 Rental', distance: '1.2 km', rating: 4.3, description: 'Affordable and reliable car rental service.', email: 'a1rental@gmail.com', phoneNumber: 987654321, imgUrl: 'assets/images/car.png', thresholdPrice: 2000, price1: 2000 },
    { name: 'Flex Ride', distance: '1 km', rating: 4.2, description: 'Flexible and convenient rental options.', email: 'flexrental@gmail.com', phoneNumber: 987654321, imgUrl: 'assets/images/car.png', thresholdPrice: 2000, price1: 2000 },
    { name: 'Go Fast Rental', distance: '2 km', rating: 4.3, description: 'Fast and easy car rentals.', email: 'gofastrental@gmail.com', phoneNumber: 987654321, imgUrl: 'assets/images/car.png', thresholdPrice: 2000, price1: 2000 },
    { name: 'Best Rental', distance: '2.1 km', rating: 4.5, description: 'Best value rental service in the city.', email: 'bestrental@gmail.com', phoneNumber: 987654321, imgUrl: 'assets/images/car.png', thresholdPrice: 2000, price1: 2000 },
    { name: 'Go Fast Rental', distance: '2 km', rating: 4.3, description: 'Fast and easy car rentals.', email: 'gofastrental@gmail.com', phoneNumber: 987654321, imgUrl: 'assets/images/car.png', thresholdPrice: 2000, price1: 2000 },
    { name: 'Flex Ride', distance: '1 km', rating: 4.2, description: 'Flexible and convenient rental options.', email: 'flexrental@gmail.com', phoneNumber: 987654321, imgUrl: 'assets/images/car.png', thresholdPrice: 2000, price1: 2000 },
    { name: 'A1 Rental', distance: '1.2 km', rating: 4.3, description: 'Affordable and reliable car rental service.', email: 'a1rental@gmail.com', phoneNumber: 987654321, imgUrl: 'assets/images/car.png', thresholdPrice: 2000, price1: 2000 },
    { name: 'Best Rental', distance: '2.1 km', rating: 4.5, description: 'Best value rental service in the city.', email: 'bestrental@gmail.com', phoneNumber: 987654321, imgUrl: 'assets/images/car.png', thresholdPrice: 2000, price1: 2000 },
    { name: 'A1 Rental', distance: '1.2 km', rating: 4.3, description: 'Affordable and reliable car rental service.', email: 'a1rental@gmail.com', phoneNumber: 987654321, imgUrl: 'assets/images/car.png', thresholdPrice: 2000, price1: 2000 },
  ];
  constructor(
    private router: Router
  ) {
    
  }

  showModal = false;
  // showPaymentModal = false;
  selectedVehicle?: Vehicle;

  paymentMethod: string = '';

  viewMore(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
    this.router.navigate(['/businessdetail']);
    
  }

  closeModal(): void {
    this.showModal = false;
  }

  // for payment

  // openPaymentModal(): void {
  //   this.showModal = false;
  //   this.showPaymentModal = true;
  // }

  // closePaymentModal(): void {
  //   this.showPaymentModal = false;
  // }

  // selectPaymentMethod(method: string): void {
  //   this.paymentMethod = method;
  // }

  // processPayment(): void {
  //   if (this.paymentMethod === '') {
  //     alert('Please select a payment method.');
  //     return;
  //   }
  //   alert(`Payment processed using: ${this.paymentMethod}`);
  //   this.closePaymentModal();
  // }

}