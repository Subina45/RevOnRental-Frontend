import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-addvehicle',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule, CommonModule, RouterModule],
  templateUrl: './addvehicle.component.html',
  styleUrls: ['./addvehicle.component.css']
})
export class AddvehicleComponent {
  VehicleType: string = 'bicycle'; // Default selection (Bicycle)
  NumberOfVehicle: number = 1;
  Brand: string = '';
  Model: string = '';
  Photo: File | null = null;

  // Status and price fields
  AvailabilityStatus: boolean = true;
  HourlyRate: number | null = null; // Hourly rate
  HalfDayRate: number | null = null; // Half-day rate
  FullDayRate: number | null = null; // Full-day rate

  // Inject HttpClient in the constructor for making HTTP requests
  constructor(private http: HttpClient) {}

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

    // Append vehicle details to the form data
    formData.append('VehicleType', this.VehicleType);
    formData.append('Brand', this.Brand);
    formData.append('Model', this.Model);
    formData.append('NumberOfVehicle', this.NumberOfVehicle.toString());

    // Append prices for all three periods
    formData.append('HourlyRate', this.HourlyRate ? this.HourlyRate.toString() : '0');
    formData.append('HalfDayRate', this.HalfDayRate ? this.HalfDayRate.toString() : '0');
    formData.append('FullDayRate', this.FullDayRate ? this.FullDayRate.toString() : '0');

    // Append availability status
    formData.append('AvailabilityStatus', this.AvailabilityStatus.toString());

    // Append the business registration file if available
    if (this.Photo) {
      formData.append('Photo', this.Photo);
    }

    // Append the BusinessId (this should come from your application state, replace with actual value)
    formData.append('BusinessId', '123'); // Replace with the actual business ID

    // Send the POST request to the backend API
    this.http.post('https://localhost:7275/api/Vehicle/add', formData)
      .subscribe(
        (response) => {
          console.log('Vehicle added successfully', response);
          this.closePopup(); // Close the popup on success
        },
        (error) => {
          console.error('Failed to add vehicle', error);
        }
      );
  }
}
