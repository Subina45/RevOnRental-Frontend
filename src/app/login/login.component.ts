import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../aservice/auth.service';
import { LoginstateService } from '../aservice/loginstate.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterOutlet, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loggedUserData: any;

  // Object for login
  loginObj: any = {
    email: '',
    password: ''
  };

  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loginStateService: LoginstateService
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    console.log('Login Object:', this.loginObj);

    this.authService.loginUser(this.loginObj).subscribe({
      next: (res) => {
        console.log('Login successful', res);

        // Assuming the token is returned in `res.token`
      const token = res.token;
      if (token) {
        this.authService.setToken(token); // Save the token
        this.loginStateService.setLoginStatus(true); // Update login status
        this.router.navigate(['/search']); // Navigate after login
      } else {
        alert('Token not received. Please try again.');
      }
    },
    error: (err) => {
      console.error('Login failed', err);
      alert('Invalid email or password.');
    }
  });
    //     // Set the login status to true
    //     this.loginStateService.setLoginStatus(true);
    //     // Navigate to the search page after successful login
    //     this.router.navigate(['/search']);
    //   },
    //   error: (err) => {
    //     console.error('Login failed', err);
    //     if (err.error && err.error.errors) {
    //       // Assuming validation errors are provided in 'err.error.errors'
    //       console.log('Validation errors:', err.error.errors);
    //       alert('Validation errors occurred. Please check the inputs.');
    //     } else {
    //       // Display a generic error message
    //       alert('Invalid email or password.');
    //     }
    //   }
    // });
  }
}
