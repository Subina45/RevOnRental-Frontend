import { CommonModule } from '@angular/common';
import { Component,inject,OnInit, } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet,Router } from '@angular/router';
import { AuthService } from '../aservice/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';
import { LoginstateService } from '../aservice/loginstate.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive,CommonModule,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  showProfileModal = false; // Initially hidden
  menuOpen: boolean = false;
  isLoggedIn: boolean = false;
  

  toggleMenu(): void{
    this.menuOpen = !this.menuOpen;
  }
  constructor(
    private loginStateService: LoginstateService,
    private router: Router,
    private authservice: AuthService
  ){}
  
  ngOnInit():void {
    this.loginStateService.isLoggedIn.subscribe((status) =>{
      this.isLoggedIn = status;
    }); 
  }
  onLogout():void{
    this.loginStateService.logout();
    this.authservice.logout();


  }

  userProfile = {
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    phone: '987654321',
    imageUrl: 'assets/images/user-profile.png'
  };

  // Function to open the profile modal
  openProfileModal(): void {
    this.showProfileModal = true;
  }
  // Function to close the profile modal
  closeProfileModal(): void {
    this.showProfileModal = false;
  }

  editProfile(): void {
    alert('Edit profile feature is coming soon!');
  }
  forgotPassword(): void {
    alert('Edit profile feature is coming soon!');
  }
  viewBookingHistory(): void {
    // alert('Edit profile feature is coming soon!');
    this.router.navigate(['/userbookinghistory']);
    this.showProfileModal=false;
  }

   
}