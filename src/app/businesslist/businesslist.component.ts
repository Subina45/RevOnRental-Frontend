
import { CommonModule, NgFor } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { RouterLink, RouterOutlet,Router } from '@angular/router';
import { SharedService } from '../aservice/shared.service';
import { VehicleService } from '../aservice/vehicle.service';
import { AuthService } from '../aservice/auth.service';
// import { throwError } from 'rxjs';
// import { HttpHeaders ,HttpClient} from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
// import { AuthService } from './auth.service'; // Import AuthService

interface Vehicle {
  name: string;
  distance: string;
  rating: number;
  address: string;
  email: string;
  phoneNumber: number;
  imgUrl: string;
  thresholdPrice: number;
  price1: number;
  model:string;
  brand:string;
  hourlyRate:number;


}
interface BusinessVehicles {
  businessId: string;
  businessName: string;
  averageRating: number;
  reviews: any[];
  address: string;
  contactNumber: string;
  vehicles: Vehicle[];
}

@Component({
  selector: 'app-businesslist',
  standalone: true,
  imports: [NgFor, CommonModule,RouterLink,RouterOutlet],
  templateUrl: './businesslist.component.html',
  styleUrl: './businesslist.component.css'
})

export class BusinesslistComponent implements OnInit {
  businessId: string = '9'; // Replace with dynamic ID as needed
  businessDetails: any;
  vehicles: any[] = [];
  showModal: boolean = false;
  searchDetails: any = {}; // To hold search details like locations and dates
  selectedVehicle: any = null;// To store selected vehicle details for the modal
 

  constructor(private sharedService: SharedService,private vehicleService: VehicleService,private http :HttpClient
    ,private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.fetchBusinessDetails();
  
    
    // Retrieve data from router state
    const navigation = window.history.state;
    if (navigation.searchResults && navigation.searchDetails) {
      this.vehicles = navigation.searchResults;
      this.searchDetails = navigation.searchDetails;
    } else {
      // Fallback to shared service
      this.vehicles = this.sharedService.getSearchResults();
      this.searchDetails = this.sharedService.getSearchDetails();
    }
  
    // Log error if no data is found
    if (!this.vehicles || !this.searchDetails) {
      console.error('No data found in shared service or router state.');
    }
  }

  //veiw detail

  //get business detail

  getBusinessDetails(businessId: string): Observable<any> {
    console.log('Inside get business detail');
    // Retrieve the token from AuthService
    const token = this.authService.getToken();

    if (!token) {
      // Handle the case when token is not available
      console.error('No authentication token found.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    // Create headers and include the Authorization header
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      // No need to set 'Content-Type' for FormData
    });
    return this.http.get(`https://localhost:7275/api/VehicleRental/business-details/${businessId}`, { headers }).pipe(
     catchError((error) => {
       console.error('Error showing data:', error);
       return throwError(() => new Error('Failed to show the data.'));
     })
   );
}
  
  // Fetch business details from the service
  fetchBusinessDetails(): void {
    this.vehicleService.getBusinessDetails(this.businessId).subscribe({
      next: (data) => {
        this.businessDetails = data;
        this.processVehicles(data.availableVehicles);
      },
      error: (err) => {
        console.error('Error fetching business details:', err);
      }
    });
  }




  // Process vehicles to include image URLs and additional business info
  processVehicles(vehicles: any[]): void {
    // Create a Set to track unique business IDs and ensure no duplicates
    const seenBusinessIds = new Set<string>();
  
    this.vehicles = vehicles.filter(vehicle => {
      if (seenBusinessIds.has(vehicle.businessId)) {
        return false; // Skip this vehicle if we've already processed this business ID
      }
      seenBusinessIds.add(vehicle.businessId);
      return true; // Keep this vehicle
    }).map(vehicle => ({
      ...vehicle,
      businessName: this.businessDetails.businessName,
      rating: this.businessDetails.averageRating,
      reviews: this.businessDetails.reviews,
      distance: this.calculateDistance(), // Implement distance calculation if needed
      imgUrl: this.getImageUrl(vehicle.photo)
    }));
  }
  

  // Convert base64 image content to a usable URL
  getImageUrl(photo: any): string {
    if (photo && photo.contentType && photo.fileContent) {
      return `data:${photo.contentType};base64,${photo.fileContent}`;
    }
    // Return a placeholder image if no photo is available
    return 'assets/images/placeholder.png';
  }

  // Example distance calculation (replace with actual logic)
  calculateDistance(): number {
    return 10; // Example static value
  }

  // Open modal with selected vehicle details
  // viewMore(vehicle: any): void {
  //   console.log('Selected vehicle:', vehicle);
  //   this.selectedVehicle = vehicle;
  //   this.showModal = true;

  // }
  // Open modal with all vehicles of the selected business
viewMore(vehicle: any): void {
  console.log('Selected vehicle business:', vehicle.businessName);
  this.selectedVehicle = vehicle;  // Just to highlight the selected one
  this.showModal = true;

  // Fetch all vehicles related to the selected business for the modal display
  this.businessDetails.vehicles = this.businessDetails.vehicles || [];
}

// Method to handle selecting a vehicle
selectVehicle(vehicle: Vehicle): void {
  console.log('User selected vehicle:', vehicle);
  this.selectedVehicle = vehicle;
  this.showModal = false;
  // Perform further actions, such as booking or displaying more details
}

  // Close the modal
  closeModal(): void {
    this.showModal = false;
    this.selectedVehicle = null;
  }
}


