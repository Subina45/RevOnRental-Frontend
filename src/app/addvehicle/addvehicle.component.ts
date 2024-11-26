import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { VehicleService } from '../aservice/vehicle.service';
import {LoginstateService} from '../aservice/loginstate.service';


@Component({
  selector: 'app-addvehicle',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './addvehicle.component.html',
  styleUrls: ['./addvehicle.component.css']
})
export class AddvehicleComponent {

  VehicleType: string = ''; 
  getVehicleTypeValue(): string {
    switch (this.VehicleType) {
      case 'car':
        return '0';
      case 'bike':
        return '1';
      case 'bicycle':
        return '2';
      default:
        return '0'; // Default to 'car' if no match found
    }
  }
  NumberOfVehicle: number = 1;
  Brand: string = '';
  Model: string = '';
  Photo: File | null = null;

  // Status and price fields
  AvailabilityStatus: boolean = true;
  getAvailabilityStatusValue(): boolean {
    return this.AvailabilityStatus;
  }
  HourlyRate: number | null = null; // Hourly rate
  HalfDayRate: number | null = null; // Half-day rate
  FullDayRate: number | null = null; // Full-day rate

  // Inject HttpClient in the constructor for making HTTP requests
  constructor(
    private http: HttpClient,
    private vehicleservice: VehicleService,
    private loginStateService: LoginstateService
  ) { }

  onVehicleChange() {
    console.log(`Vehicle Type: ${this.VehicleType}`);
  }

  @Output() close = new EventEmitter<void>();

  closePopup(): void {
    this.close.emit();
  }

  // Method to handle file input change for the vehicle's photo
  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      this.Photo = inputElement.files[0];
    }
  }

  // Method to submit the vehicle data to the backend
  onSubmit(event: Event): void {
    
    event.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData();

    // Convert vehicle type and availability status to numeric values
  const vehicleTypeValue = this.getVehicleTypeValue();
  const availabilityStatusValue = this.getAvailabilityStatusValue();
  const businessId = this.loginStateService.getBusinessId();

    // Append vehicle details to the form data
    formData.append('VehicleType', vehicleTypeValue);
    formData.append('Brand', this.Brand);
    formData.append('Model', this.Model);
    formData.append('NumberOfVehicle', this.NumberOfVehicle.toString());

    // Append prices for all three periods
    formData.append('HourlyRate', this.HourlyRate ? this.HourlyRate.toString() : '0');
    formData.append('HalfDayRate', this.HalfDayRate ? this.HalfDayRate.toString() : '0');
    formData.append('FullDayRate', this.FullDayRate ? this.FullDayRate.toString() : '0');

    // Append availability status
    formData.append('AvailabilityStatus', availabilityStatusValue.toString());

    // Append the business registration file if available
    if (this.Photo) {
      formData.append('Photo', this.Photo);
    }

    if(businessId != null){
    formData.append('BusinessID', businessId); 
    }

    // Send the POST request to the backend API
    this.vehicleservice.addVehicle(formData).subscribe({
      next: (response) => {
        console.log('Vehicle added successfully', response);
        this.closePopup(); // Close the popup on success
      },
      error: (error) => {
        console.error('Failed to add vehicle', error);
      },
    });
  }
}
