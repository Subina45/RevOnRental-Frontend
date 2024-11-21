import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { BrowserModule } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Chart } from 'chart.js/auto';
// import { NgModule } from '@angular/core';
// import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink,RouterOutlet,CommonModule,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  vehicles = [
    {
      type: 'Car',
      quantity: 10,
      available: 6,
      imageUrl: 'assets/images/hero.png',
    },
    {
      type: 'Scooter',
      quantity: 15,
      available: 9,
      imageUrl: 'assets/images/bike.png',
    },
    {
      type: 'Bicycle',
      quantity: 20,
      available: 12,
      imageUrl: 'assets/images/bicycle.png',
    },
  ];
  

  constructor() {}

  ngOnInit() {
    // Initialize vehicles
    // this.vehicles = [
    //   { id: 1, name: 'Sedan', available: true },
    //   { id: 2, name: 'SUV', available: false },
    //   { id: 3, name: 'Truck', available: true }
    // ];

    // Render charts
    this.renderRentalTrendsChart();
    this.renderVehicleUtilizationChart();
  }

  renderRentalTrendsChart() {
    const chartElement = document.getElementById('rentalTrendsChart') as HTMLCanvasElement;
    if (chartElement) {
      new Chart(chartElement, {
        type: 'pie',
        data: {
          labels: ['car', 'Scooter/Bike', 'Bicycle', ],
          datasets: [
            {
              label: 'Rentals',
              data: [50, 75, 100],
              backgroundColor: ['#007bff', '#28a745', '#ffc107']
            }
          ]
        },    options: {
          animation: {
            duration: 6000 // Slower animation (2 seconds)
          }
        }
      });
    }
  }

  renderVehicleUtilizationChart() {
    const chartElement = document.getElementById('vehicleUtilizationChart') as HTMLCanvasElement;
    if (chartElement) {
      new Chart(chartElement, {
        type: 'bar',
        data: {
          labels: ['Car', 'Scooter/Bike', 'Bicycle'],
          datasets: [
            {
              label: 'Utilization (%)',
              data: [80, 70, 60],
              backgroundColor: ['#007bff', '#28a745', '#dc3545']
            }
          ]
        },    options: {
          animation: {
            duration: 6000 // Slower animation (2 seconds)
          }
        }
      });
    }
  }
    //add vehicle pop up 
    selectedVehicle: string = 'bicycle'; // Default selection (Bicycle)
    quantity: number = 1;
    brandName: string = '';
    model: string = '';
    businessRegistration: File | null = null;
  
    onVehicleChange() {
      // Handle any additional logic when vehicle type is changed, if needed.
      console.log(`Selected vehicle: ${this.selectedVehicle}`);
    }
    isModalVisible = false; // Track modal visibility
  
    showModal() {
      this.isModalVisible = true; // Show the modal
    }
  
    closeModal() {
      this.isModalVisible = false; // Hide the modal
    }
  
      // Handle form submission
      submitForm() {
        console.log('Form Submitted!');
        console.log('Vehicle Type:', this.selectedVehicle);
        console.log('Quantity:', this.quantity);
        if (this.brandName) console.log('Brand Name:', this.brandName);
        if (this.model) console.log('Model:', this.model);
    
        // Perform additional form processing (e.g., API call)
    
        // Close the modal and return to the dashboard
        this.closeModal();
      }
      
  
}
