export interface Vehicle {
  id: number;
  name: string;
  photo: string;
  quantity: number;
  available: boolean;
  brand?: string;         // Add brand
  model?: string;         // Add model
  hourlyRate?: number;    // Add hourly rate
  halfDayRate?: number;   // Add half-day rate
  fullDayRate?: number;   // Add full-day rate
}
import { CommonModule } from '@angular/common';
import { Component,EventEmitter,Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { AddvehicleComponent } from '../addvehicle/addvehicle.component';
import { ViewdetailpopupComponent } from "../viewdetailpopup/viewdetailpopup.component";
import { UpdatedeleteComponent } from '../updatedelete/updatedelete.component';
import { HttpClient } from '@angular/common/http';
import { VehicleService } from '../aservice/vehicle.service';
import { LoginstateService } from '../aservice/loginstate.service';
// import { AddvehicleComponent } from "../addvehicle/addvehicle.component";
declare var bootstrap: any;

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, AddvehicleComponent, ViewdetailpopupComponent,UpdatedeleteComponent],
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css'],
})
  export class VehicleComponent {
    // selectedVehicle: any = null;
    // showPopup: boolean = false;

    vehicles = {
      cars: [
        { id: 1, name: 'Toyota Prius', photo: 'assets/images/car.png', quantity: 5, available: true, brand: 'Toyota', model: 'Prius', hourlyRate: 20, halfDayRate: 60, fullDayRate: 100 },
        { id: 2, name: 'Honda Civic', photo: 'assets/images/car.png', quantity: 3, available: false, brand: 'Honda', model: 'Civic', hourlyRate: 18, halfDayRate: 54, fullDayRate: 90 },
        { id: 1, name: 'Toyota Prius', photo: 'assets/images/car.png', quantity: 5, available: true, brand: 'Toyota', model: 'Prius', hourlyRate: 20, halfDayRate: 60, fullDayRate: 100 },
        { id: 2, name: 'Honda Civic', photo: 'assets/images/car.png', quantity: 3, available: false, brand: 'Honda', model: 'Civic', hourlyRate: 18, halfDayRate: 54, fullDayRate: 90 },
        { id: 1, name: 'Toyota Prius', photo: 'assets/images/car.png', quantity: 5, available: true, brand: 'Toyota', model: 'Prius', hourlyRate: 20, halfDayRate: 60, fullDayRate: 100 },
        { id: 2, name: 'Honda Civic', photo: 'assets/images/car.png', quantity: 3, available: false, brand: 'Honda', model: 'Civic', hourlyRate: 18, halfDayRate: 54, fullDayRate: 90 }
      ],
      bikes: [
        { id: 1, name: 'Harley Davidson', photo: 'assets/images/bike.png', quantity: 2, available: true, brand: 'Harley', model: 'Davidson', hourlyRate: 15, halfDayRate: 45, fullDayRate: 80 },
        { id: 1, name: 'Harley Davidson', photo: 'assets/images/bike.png', quantity: 2, available: true, brand: 'Harley', model: 'Davidson', hourlyRate: 15, halfDayRate: 45, fullDayRate: 80 },
        { id: 1, name: 'Harley Davidson', photo: 'assets/images/bike.png', quantity: 2, available: true, brand: 'Harley', model: 'Davidson', hourlyRate: 15, halfDayRate: 45, fullDayRate: 80 },
        { id: 1, name: 'Harley Davidson', photo: 'assets/images/bike.png', quantity: 2, available: true, brand: 'Harley', model: 'Davidson', hourlyRate: 15, halfDayRate: 45, fullDayRate: 80 },
        { id: 1, name: 'Harley Davidson', photo: 'assets/images/bike.png', quantity: 2, available: true, brand: 'Harley', model: 'Davidson', hourlyRate: 15, halfDayRate: 45, fullDayRate: 80 },
        { id: 1, name: 'Harley Davidson', photo: 'assets/images/bike.png', quantity: 2, available: true, brand: 'Harley', model: 'Davidson', hourlyRate: 15, halfDayRate: 45, fullDayRate: 80 }
      ],
      bicycles: [
        { id: 1, name: 'Mountain Bike', photo: 'assets/images/bicycle.png', quantity: 10, available: true, brand: 'MTB', model: 'XTR', hourlyRate: 5, halfDayRate: 15, fullDayRate: 30 },
        { id: 1, name: 'Mountain Bike', photo: 'assets/images/bicycle.png', quantity: 10, available: true, brand: 'MTB', model: 'XTR', hourlyRate: 5, halfDayRate: 15, fullDayRate: 30 },
        { id: 1, name: 'Mountain Bike', photo: 'assets/images/bicycle.png', quantity: 10, available: true, brand: 'MTB', model: 'XTR', hourlyRate: 5, halfDayRate: 15, fullDayRate: 30 },
        { id: 1, name: 'Mountain Bike', photo: 'assets/images/bicycle.png', quantity: 10, available: true, brand: 'MTB', model: 'XTR', hourlyRate: 5, halfDayRate: 15, fullDayRate: 30 },
        { id: 1, name: 'Mountain Bike', photo: 'assets/images/bicycle.png', quantity: 10, available: true, brand: 'MTB', model: 'XTR', hourlyRate: 5, halfDayRate: 15, fullDayRate: 30 }

      ]

    };

 

    VehicleType: string = '';
    getVehicleTypeValue(): string {
      switch (this.VehicleType) {
        case 'car':
          return '2';
        case 'bike':
          return '1';
        case 'bicycle':
          return '0';
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
      private loginStateService: LoginstateService,
      private router: Router
    ) { }

    navigateTo(path: string) {
      this.router.navigate([path]);
    }
  
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
  
      if (businessId != null) {
        formData.append('BusinessID', businessId);
        console.log("Business Id:", businessId);
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



  openPopup(): void {
    this.showPopup = true;
  }



  selectedVehicle: Vehicle | null = null;  // Track selected vehicle
  showPopup: boolean = false;  // Track if the popup is visible

  viewMore(vehicle: Vehicle) {
    this.selectedVehicle = vehicle;  // Set selected vehicle
    this.showPopup = true;  // Open the popup
  }


  // closePopup(): void {
  //   this.showPopup = false;
  // }

  // State for Add Inventory Popup
  showAddInventoryPopup: boolean = false;

  // Function to open the Add Inventory Popup
  openAddInventoryPopup(): void {
    this.showAddInventoryPopup = true;
   // Close vehicle details popup if open
  }
    // Function to close the Add Inventory Popup
    closeAddInventoryPopup(): void {
      this.showAddInventoryPopup = false;
    }
   // Holds the currently selected vehicle
    showModal: boolean = false; // Controls the visibility of the modal

    openUpdateDeleteModal(vehicle: any) {
      this.selectedVehicle = vehicle; // Pass the vehicle data to the child component
      this.showModal = true; // Open the modal
    }
  
    closeModal() {
      this.showModal = false; // Close the modal
    }
  
    onUpdate(carId: number) {
      console.log('Update clicked for car with ID:', carId);
      // Add logic to open update modal or navigate to update page
    }
  
    onDelete(carId: number) {
      console.log('Delete clicked for car with ID:', carId);
      // Add logic to confirm deletion or open delete modal
    }
    


    // update delete

      selectedCar: any = {};
      isUpdateMode: boolean = true;
    
      // Open the Update Modal
      openUpdateModal(car: any) {
        this.selectedCar = { ...car }; // Copy the car details
        this.isUpdateMode = true; // Set to update mode
        const modalElement = document.getElementById('vehicleActionModal');
        const modal = new bootstrap.Modal(modalElement!);
        modal.show();
      }
    
      // Open the Delete Modal
      openDeleteModal(carId: number) {
        this.selectedCar = { id: carId }; // Only need the ID for delete
        this.isUpdateMode = false; // Set to delete mode
        const modalElement = document.getElementById('vehicleActionModal');
        const modal = new bootstrap.Modal(modalElement!);
        modal.show();
      }
    
      // Handle Update Action
      handleUpdate(updatedCar: any) {
        console.log('Updated vehicle details:', updatedCar);
        // Add your logic to update the vehicle, e.g., call an API to update the database
      }
    
      // Handle Delete Action
      handleDelete(carId: number) {
        console.log('Vehicle deleted with ID:', carId);
        // Add your logic to delete the vehicle, e.g., call an API to delete the record
      }


}
