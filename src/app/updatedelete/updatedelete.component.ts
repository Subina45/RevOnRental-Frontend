import { CommonModule } from '@angular/common';
import { Component,Input,Output,EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-updatedelete',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './updatedelete.component.html',
  styleUrl: './updatedelete.component.css'
})
export class UpdatedeleteComponent {
  @Input() vehicle: any; // Receive selected vehicle from the parent
  @Output() close = new EventEmitter<void>(); // Emit an event to close the modal after the action

  // Update the vehicle details
  saveUpdate() {
    console.log('Vehicle updated:', this.vehicle);
    // Here, you would call your service to update the vehicle in the backend.
    // For example, if you're using an API service:
    // this.vehicleService.updateVehicle(this.vehicle).subscribe(...);
    this.closeModal();
  }

  // Confirm delete
  confirmDelete() {
    console.log('Vehicle deleted:', this.vehicle);
    // Here, you would call your service to delete the vehicle.
    // this.vehicleService.deleteVehicle(this.vehicle.id).subscribe(...);
    this.closeModal();
  }

  // Close the modal
  closeModal() {
    this.close.emit(); // Emit the event to the parent to handle modal closing
  }

}
