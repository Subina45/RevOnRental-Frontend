
import { CommonModule } from '@angular/common';
import { Component, HostListener, NgZone } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../aservice/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-basicinfo',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './basicinfo.component.html',
  styleUrl: './basicinfo.component.css'
})
export class BasicinfoComponent {

  businessType: string = 'individual';

  businessData: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    contactNumber: '',
    address: '',
    latitude: 0,
    longitude: 0,
    businessName: '',
    businessRegistrationNumber: '',
    vehiclePlateNumber: '',
    nationalIdFront: null,
    nationalIdBack: null,
    bluebook: null,
    businessRegistrationDocument: null,
    businessType: 0
  };

  suggestions: any[] = []; // To hold address suggestions

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private ngZone: NgZone

  ) { }


  toggleForm(event: any): void {
    this.businessType = event.target.value;
    this.businessData.businessType = this.businessType === 'individual' ? 0 : 1;
  }

  // Function to get address suggestions from Nominatim API
  onAddressInput(query: string) {
    if (query.length > 2) {
      const apiUrl = `https://nominatim.openstreetmap.org/search?q=${query}+pokhara&format=json&addressdetails=1&limit=5`;
      this.http.get(apiUrl).subscribe((response: any) => {
        this.ngZone.run(() => {
          this.suggestions = response;
        });
      });
    } else {
      this.suggestions = [];
    }
  }
  // Handle address input change
  handleAddressInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.onAddressInput(inputElement.value);
    }
  }

  // Function to select address from the suggestions list
  selectSuggestion(suggestion: any) {
    this.ngZone.run(() => {
      // Extracting only the desired portion of the address
      const addressParts = suggestion.display_name.split(',');
      const requiredAddressParts = addressParts.slice(0, 4); // Take only the first 4 parts
      this.businessData.address = requiredAddressParts.join(', ').trim();

      // Store latitude and longitude from the suggestion
      this.businessData.latitude = parseFloat(suggestion.lat);
      this.businessData.longitude = parseFloat(suggestion.lon);

      // Clear the suggestions after selection
      this.suggestions = [];

      console.log('Selected Address:', this.businessData.address);
      console.log('Latitude:', this.businessData.latitude, 'Longitude:', this.businessData.longitude);
    });
  }


  // Event Listener for clicking outside the suggestions box
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;

    // Close the suggestions if clicked outside the address input or suggestion box
    if (
      clickedElement &&
      !clickedElement.closest('.suggestions-list') &&
      clickedElement.id !== 'address-input'
    ) {
      this.suggestions = [];
    }
  }

  // Handle file input changes
  onFileChange(event: Event, fieldName: string) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      this.businessData[fieldName] = inputElement.files[0];
    }
  }

  onSubmit(): void {

    // Ensure required files are selected
    // if (!this.businessData.nationalIdFront || !this.businessData.nationalIdBack || (this.businessType === 'company' && !this.businessData.businessRegistrationDocument)) {
    //   alert('Please upload all required documents before submitting the form.');
    //   return;
    // }

    // Create a new FormData instance
    console.log('Business Data before submission:', this.businessData);
    const formData: FormData = new FormData();


    // Append individual fields from the businessData object to formData
    formData.append('firstName', this.businessData.firstName);
    formData.append('lastName', this.businessData.lastName);
    formData.append('email', this.businessData.email);
    formData.append('password', this.businessData.password);
    formData.append('contactNumber', this.businessData.contactNumber);
    formData.append('address', this.businessData.address);
    formData.append('latitude', this.businessData.latitude.toString());
    formData.append('longitude', this.businessData.longitude.toString());



    if (this.businessData.businessType === 0) {
      // Individual Type append national ID and bluebook files
      if (this.businessData.nationalIdFront) {
        formData.append('nationalIdFront', this.businessData.nationalIdFront);
      }
      if (this.businessData.nationalIdBack) {
        formData.append('nationalIdBack', this.businessData.nationalIdBack);
      }
      if (this.businessData.bluebook) {
        formData.append('bluebook', this.businessData.bluebook);
      }
    } else if (this.businessData.businessType === 1) {
      // Company Type append business-specific data
      formData.append('businessName', this.businessData.businessName);
      formData.append('businessRegistrationNumber', this.businessData.businessRegistrationNumber);
      if (this.businessData.businessRegistrationDocument) {
        formData.append('businessRegistrationDocument', this.businessData.businessRegistrationDocument);
      }
    }
    // Submit the form data using the AuthService
    this.authService.createBusiness(formData).subscribe({
      next: (res) => {
        console.log('Business registered successfully', res);
        this.router.navigate(['/dashboard']);

      },
      error: (err) => {
        console.error('Failed to register business', err);
      }
    }
    );
  }
}
