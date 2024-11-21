import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-addvehicle',
  standalone: true,
  imports: [RouterOutlet, RouterLink,FormsModule,CommonModule],
  templateUrl: './addvehicle.component.html',
  styleUrl: './addvehicle.component.css'
})
export class AddvehicleComponent {
  selectedVehicle: string = 'bicycle'; // Default selection (Bicycle)
  quantity: number = 1;
  brandName: string = '';
  model: string = '';
  businessRegistration: File | null = null;
  price: number | null = null; // For price input
  pricePeriod: string = ''; 

  onVehicleChange() {
    // Handle any additional logic when vehicle type is changed, if needed.
    console.log(`Selected vehicle: ${this.selectedVehicle}`);
  }
}


