import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../aservice/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { Subscription, throwError } from 'rxjs';
import { LoginstateService } from '../aservice/loginstate.service';
import { VehicleService } from '../aservice/vehicle.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  showProfileModal = false; // Initially hidden
  showEditProfileModal = false; // For edit profile modal
  menuOpen: boolean = false;
  isLoggedIn: boolean = false;
  userProfile: any = null; // User profile data


  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
  constructor(
    private loginStateService: LoginstateService,
    private router: Router,
    private authservice: AuthService,
    private vehicleservice: VehicleService
  ) { }

  ngOnInit(): void {
    const userId = 1061;
    this.loginStateService.isLoggedIn.subscribe((status) => {
      const token = this.authservice.getToken();
      if (!token) {
        console.error('No authentication token found.');
        throwError(() => new Error('User is not authenticated.'));
      } else {
        this.isLoggedIn = status;
        this.fetchUserProfile(userId); // Fetch profile if logged in
      }

    });
  }
  onLogout(): void {
    this.loginStateService.logout();
    this.authservice.logout();


  }

  // userProfile = {
  //   name: 'John Doe',
  //   email: 'john.doe@gmail.com',
  //   phone: '987654321',
  //   imageUrl: 'assets/images/user-profile.png'
  // };


  fetchUserProfile(userId: number): void {

    this.vehicleservice.getUserDetails(userId).subscribe(
      (response) => {
        this.userProfile = response; // Bind user profile data
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }
  // Function to open the profile modal
  openProfileModal(): void {
    this.showEditProfileModal = false; // Ensure edit modal is hidden
    this.showProfileModal = true;
  }
  // Function to close the profile modal
  closeProfileModal(): void {
    this.showProfileModal = false;
  }

  openEditProfileModal(): void {
    this.showProfileModal = false; // not to open both modal at the same time
    this.showEditProfileModal = true;
  }

  closeEditProfileModal(): void {
    this.showEditProfileModal = false;
  }
  // Method to save the edited profile data
  saveProfile(): void {
    console.log('Profile changes saved:', this.userProfile);
    this.closeEditProfileModal();
  }

  editProfile(): void {
    this.openEditProfileModal();
  }
  // notification(): void {
  //   this.router.navigate(['/usernotification']);
  // }
  viewBookingHistory(): void {
    // alert('Edit profile feature is coming soon!');
    this.router.navigate(['/userbookinghistory']);
    this.showProfileModal = false;
  }


}