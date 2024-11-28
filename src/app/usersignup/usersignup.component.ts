import { Component, inject, NgZone, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../aservice/auth.service';

// import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-usersignup',
  standalone: true,
  imports: [FormsModule, RouterOutlet, RouterLink, CommonModule, HttpClientModule],
  templateUrl: './usersignup.component.html',
  styleUrl: './usersignup.component.css'
})

export class UsersignupComponent {
  // showModal = false;
  // loggedUserData:any;
  // // object for login
  // loginObj: any = {
  //   "email": "",
  //   "password": "",
  // };
  // // constructor(private authsrv: AuthService,private router: Router){}
  // // for password show hide icon
  // // showPassword = false;
  // // togglePasswordVisibility() {
  // //   this.showPassword = !this.showPassword;
  // // }
  // // http = inject(HttpClient);

  // onLogin(){
  //   console.log('Login Object:',this.loginObj);

  //     this.authsrv.loginUser(this.loginObj).subscribe({
  //       next: (res) =>{
  //         console.log('Signup successful', res);
  //       // Navigate to the search page after successful signup
  //       this.router.navigate(['/search']);
  //       },
  //       error: (err) => {
  //       console.error('Login failed', err);
  //       if (err.error.errors) {
  //         console.log('Validation errors:', err.error.errors);
  //       } else {
  //         alert('Invalid email or password.');
  //       }
  //     }
  //     })



  // }
  // object for signup
  signupObj: any = {

    "firstName": "",
    "lastName": "",
    "email": "",
    "password": "",
    "contactNumber": "",
    "address": "",
    "latitude": 0,
    "longitude": 0
  };

  validationErrors: any[] = []; // Validation errors array
  suggestions: any[] = []; // To hold address suggestions


  constructor(
    private authsrv: AuthService,
    private router: Router,
    private http: HttpClient,
    private ngZone: NgZone
  ) { }

  // for password show hide icon
  showPassword = false;
  isLoading = false; // Loading state
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Function to get address suggestions from Nominatim API
  onAddressInput(query: string) {
    if (query.length > 2) {
      const apiUrl = `https://nominatim.openstreetmap.org/search?q=${query}+pokhara&format=json&addressdetails=1&limit=5`;
      this.http.get(apiUrl).subscribe((response: any) => {
        this.suggestions = response;
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
      this.signupObj.address = requiredAddressParts.join(', ').trim();

      // Store latitude and longitude from the suggestion
      this.signupObj.latitude = parseFloat(suggestion.lat);
      this.signupObj.longitude = parseFloat(suggestion.lon);

      // Clear the suggestions after selection
      this.suggestions = [];

      console.log('Selected Address:', this.signupObj.address);
      console.log('Latitude:', this.signupObj.latitude, 'Longitude:', this.signupObj.longitude);
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
  onSignUp() {
    //this line to inspect the signup object before making the API call
    console.log('Signup Object:', this.signupObj);
    this.isLoading = true; // Set loading to true when signup starts

    this.authsrv.createUser(this.signupObj).subscribe((res: any) => {
      console.log('Signup successful', res);
      this.router.navigate(['/login']);
    },
      (err) => {
        console.error('Signup failed', err);
        if (err.status === 400) {
          this.validationErrors = [];
          if (err.error) {
            for (const key in err.error) {
              if (err.error.hasOwnProperty(key)) {
                this.validationErrors.push(...err.error[key]);
              }
            }
          }
        } else if (err.status === 500) {
          console.error('Internal server error:', err.error);
        } else {
          console.error('Unexpected error:', err);
          this.validationErrors = ['An unexpected error occurred. Please try again later.'];
        }
      },
      () => {
        this.isLoading = false; // Set loading to false after signup completes
      }
    );

  }

}
