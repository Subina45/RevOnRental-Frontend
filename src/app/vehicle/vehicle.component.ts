export interface Vehicle {
  id: number;
  name: string;
  photo: string;
  quantity: number;
  available: boolean;
}
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterOutlet],
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css'],
})
  export class VehicleComponent {
    vehicles = {
      cars: [
        { id: 1, name: 'Toyota Prius', photo: 'assets/images/car.png', quantity: 5, available: true },
        { id: 2, name: 'Honda Civic', photo: 'assets/images/car.png', quantity: 3, available: false },
        { id: 3, name: 'Toyota Prius', photo: 'assets/images/car.png', quantity: 5, available: true },
        { id: 4, name: 'Honda Civic', photo: 'assets/images/car.png', quantity: 3, available: false },
        { id: 3, name: 'Toyota Prius', photo: 'assets/images/car.png', quantity: 5, available: true },
        { id: 4, name: 'Honda Civic', photo: 'assets/images/car.png', quantity: 3, available: false }
        
        
      
      ],
      bikes: [
        { id: 1, name: 'Harley Davidson', photo: 'assets/images/bike.png', quantity: 2, available: true },
        { id: 2, name: 'Yamaha R15', photo: 'assets/images/bike.png', quantity: 4, available: true },
        { id: 3, name: 'Toyota Prius', photo: 'assets/images/bike.png', quantity: 5, available: true },
        { id: 4, name: 'Honda Civic', photo: 'assets/images/bike.png', quantity: 3, available: false },
        { id: 3, name: 'Toyota Prius', photo: 'assets/images/bike.png', quantity: 5, available: true },
        { id: 4, name: 'Honda Civic', photo: 'assets/images/bike.png', quantity: 3, available: false }
      ],
      bicycles: [
        { id: 1, name: 'Mountain Bike', photo: 'assets/images/bicycle.png', quantity: 10, available: true },
        { id: 2, name: 'Road Bike', photo: 'assets/images/bicycle.png', quantity: 8, available: false },
        { id: 3, name: 'Toyota Prius', photo: 'assets/images/bicycle.png', quantity: 5, available: true },
        { id: 4, name: 'Honda Civic', photo: 'assets/images/bicycle.png', quantity: 3, available: false },
        { id: 3, name: 'Toyota Prius', photo: 'assets/images/bicycle.png', quantity: 5, available: true },
        { id: 4, name: 'Honda Civic', photo: 'assets/images/bicycle.png', quantity: 3, available: false },
        { id: 3, name: 'Toyota Prius', photo: 'assets/images/bicycle.png', quantity: 5, available: true },
        { id: 4, name: 'Honda Civic', photo: 'assets/images/bicycle.png', quantity: 3, available: false }

      ]
    };

  


  viewMore(vehicle: Vehicle) {
    alert(`View details for ${vehicle.name}`);
    // Add navigation or modal logic as needed
  }


  editVehicle(vehicle: Vehicle) {
    alert(`Edit vehicle: ${vehicle.name}`);
    // Add edit logic here
  }

  addVehicle(type: string) {
    alert(`Add a new ${type}`);
    // Add logic to open an add vehicle form or modal
  }
}
