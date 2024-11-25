import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, NgZone, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../aservice/auth.service';
import { SearchService } from '../aservice/search.service';



@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class SearchComponent {
  // Request data for search
  requestData: any = {
    vehicleType: 0,
    currentAddress: '',
    latitude: 0,
    longitude: 0,
    destinationAddress: '',
    startDateTime: '',
    endDateTime: ''
  };

  pickupFilteredLocations: any[] = [];
  destinationFilteredLocations: any[] = [];
  availableBusinesses: any[] = [];
  rentalDuration: string = '';


  constructor(
    private http: HttpClient,
    private ngZone: NgZone,
    private authService: AuthService,
    private router: Router,
    private searchService: SearchService,
  ) { }

  // Method to select a vehicle type
  selectVehicle(vehicle: string): void {
    this.requestData.vehicleType = vehicle;
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
      this.requestData.currentAddress = location.display_name;

      this.requestData.latitude = parseFloat(location.lat);
      this.requestData.longitude = parseFloat(location.lon);

      this.pickupFilteredLocations = []; // Clear suggestions after selecting one
    } else if (type === 'destination') {
      this.requestData.destinationAddress = location.display_name;
      this.destinationFilteredLocations = []; // Clear suggestions after selecting one
    }
  }


  // HostListener to listen for clicks outside the suggestion box
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    // Check if the click was outside the input fields and suggestion lists
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

  search(): void {
    // Prepare request data
    this.requestData.startDateTime = `${this.requestData.startDate}T${this.requestData.startTime}`;
    this.requestData.endDateTime = `${this.requestData.endDate}T${this.requestData.endTime}`;



    // Use AuthService to search available vehicles
    this.authService.search(this.requestData).subscribe(
      (response: any) => {
        this.ngZone.run(() => {
          this.searchService.setAvailableBusinesses(response);

          // Store rental type in localStorage for later use
          localStorage.setItem('rentalType', response.rentalType);

          this.router.navigate(['/business-list']);
        });
      },
      (error) => {
        console.error('Search failed', error);
      }
    );
  }


}



