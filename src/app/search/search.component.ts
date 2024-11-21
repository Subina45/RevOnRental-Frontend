import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, NgZone, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule,FormsModule,HttpClientModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class SearchComponent {
  selectedVehicle: string = '';
  pickupLocation: string = '';
  destinationLocation: string = '';
  pickupFilteredLocations: any[] = [];
  destinationFilteredLocations: any[] = [];

    // Variables for date and time
    pickupDate: string = '2024-12-11';
    pickupTime: string = '12:00';
    destinationDate: string = '2024-12-12';
    destinationTime: string = '12:00';

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  // Method to select a vehicle type
  selectVehicle(vehicle: string): void {
    this.selectedVehicle = vehicle;
  }

  // Function to get address suggestions from Nominatim API for locations within Pokhara
  filterLocation(event: Event, type: 'pickup' | 'destination'): void {
    const input = (event.target as HTMLInputElement).value;
    if (input.length > 2) {
      const apiUrl = `https://nominatim.openstreetmap.org/search?q=${input}+pokhara&format=json&addressdetails=1&limit=5`;
      this.http.get(apiUrl).subscribe((response: any) => {
        this.ngZone.run(() => {
          if (type === 'pickup') {
            this.pickupFilteredLocations = response;
          } else if (type === 'destination') {
            this.destinationFilteredLocations = response;
          }
        });
      });
    } else {
      if (type === 'pickup') {
        this.pickupFilteredLocations = [];
      } else if (type === 'destination') {
        this.destinationFilteredLocations = [];
      }
    }
  }

  // Function to select address from the suggestions list
  selectSuggestion(location: any, type: 'pickup' | 'destination'): void {
    if (type === 'pickup') {
      this.pickupLocation = location.display_name;
      this.pickupFilteredLocations = []; // Clear suggestions after selecting one
    } else if (type === 'destination') {
      this.destinationLocation = location.display_name;
      this.destinationFilteredLocations = []; // Clear suggestions after selecting one
    }
  }
// HostListener to listen for clicks outside the suggestion box
@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  const targetElement = event.target as HTMLElement;

  // Check if the click was outside the input fields and suggestion lists
  if (targetElement && !targetElement.closest('.suggestions-list') &&
      targetElement.id !== 'pickup-input' && targetElement.id !== 'destination-input') {
    this.pickupFilteredLocations = [];
    this.destinationFilteredLocations = [];
  }
}
  
}

