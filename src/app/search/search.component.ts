import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, NgZone, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet ,Router} from '@angular/router';
import { VehicleService } from '../aservice/vehicle.service';
import { SharedService } from '../aservice/shared.service';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule,FormsModule,HttpClientModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class SearchComponent {
  selectedVehicle: string = ''; // 'car', 'bike', or 'cycle'
  pickupLocation: string = '';
  destinationLocation: string = '';
  pickupFilteredLocations: any[] = [];
  destinationFilteredLocations: any[] = [];
  pickupDate: string = '2024-12-11';
  pickupTime: string = '12:00';
  destinationDate: string = '2024-12-12';
  destinationTime: string = '12:00';

  // Variables to hold latitude and longitude
  latitude: number = 0;
  longitude: number = 0;

  constructor(
    private http: HttpClient,
    private ngZone: NgZone,
    private vehicleService: VehicleService,
    private router: Router,
    private sharedService: SharedService // Inject the shared service
  ) {}

  // Select a vehicle type
  selectVehicle(vehicle: string): void {
    this.selectedVehicle = vehicle;
  }

  // Filter location suggestions using Nominatim API
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
      if (type === 'pickup') this.pickupFilteredLocations = [];
      else if (type === 'destination') this.destinationFilteredLocations = [];
    }
  }

  // Select suggestion from the list and dynamically set latitude and longitude
  selectSuggestion(location: any, type: 'pickup' | 'destination'): void {
    if (type === 'pickup') {
      this.pickupLocation = location.display_name;
      this.latitude = parseFloat(location.lat); // Set latitude dynamically
      this.longitude = parseFloat(location.lon); // Set longitude dynamically
      this.pickupFilteredLocations = [];
    } else if (type === 'destination') {
      this.destinationLocation = location.display_name;
      this.destinationFilteredLocations = [];
    }
  }

  // Handle clicks outside suggestions to close the dropdown
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (
      targetElement &&
      !targetElement.closest('.suggestions-list') &&
      targetElement.id !== 'pickup-input' &&
      targetElement.id !== 'destination-input'
    ) {
      this.pickupFilteredLocations = [];
      this.destinationFilteredLocations = [];
    }
  }

  // Send the search request to the API
  performSearch(): void {
    const payload = {
      vehicleType:
        this.selectedVehicle === 'car'
          ? 2
          : this.selectedVehicle === 'bike'
          ? 1
          : 0,
      currentAddress: this.pickupLocation,
      latitude: this.latitude,
      longitude: this.longitude,
      destinationAddress: this.destinationLocation,
      startDateTime: `${this.pickupDate}T${this.pickupTime}`,
      endDateTime: `${this.destinationDate}T${this.destinationTime}`,
    };

    this.vehicleService.searchVehicles(payload).subscribe({
      next: (response) => {
        console.log('Search response:', response);
        // Store the data in the shared service to handle page refreshes
        this.sharedService. setSearchData(response,{
          searchResults: response,
          searchDetails: {
            currentLocation: this.pickupLocation,
            destinationLocation: this.destinationLocation,
            startDateTime: `${this.pickupDate}T${this.pickupTime}`,
            endDateTime: `${this.destinationDate}T${this.destinationTime}`,
          },
        });

        // Navigate to the businesslist component
        this.router.navigate(['/businesslist'], {
          state: {
            searchResults: response,
            searchDetails: {
              currentLocation: this.pickupLocation,
              destinationLocation: this.destinationLocation,
              startDateTime: `${this.pickupDate}T${this.pickupTime}`,
              endDateTime: `${this.destinationDate}T${this.destinationTime}`,
            },
          },
        });
      },
      error: (error) => {
        console.error('Search failed:', error);
      },
    });
  }

  
}

