import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'authToken'; // Key to store token in localStorage
  private readonly apiUrl = environment.API_URL; // Base API URL

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // Save token in localStorage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Retrieve token
  getToken(): string | null {
    console.log('Inside Get token');
    return localStorage.getItem(this.tokenKey);
  }

  // Remove token
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Decode JWT token safely
  decodeToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwt_decode(token);
      } catch (error) {
        console.error('Error decoding token:', error);
        return null; // Return null if decoding fails
      }
    }
    return null; // Return null if no token exists
  }

  // Get logged-in role from the token
  getLoggedInRole(): string | null {
    const token: any = this.decodeToken();
    if (token && token.role) {
      return token.role.toLowerCase(); // Return role in lowercase
    }
    return null; // Return null if role is not present
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    const token: any = this.decodeToken();
    if (token) {
      const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
      return token.exp && token.exp > currentTime; // Return true if token is valid and not expired
    }
    return false;
  }

  // Logout method
  logout(): void {
    this.clearToken();
    this.router.navigate(['/home']);
    // Optionally, redirect to the login page or home page
  }

  // API Methods

  // Register user
  createUser(signupObj: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register/user`, signupObj).pipe(
      catchError((error) => {
        console.error('Error creating user:', error);
        return throwError(() => new Error('User registration failed.'));
      })
    );
  }

  // Login user
  loginUser(loginObj: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, loginObj).pipe(
      catchError((error) => {
        console.error('Login API error:', error);
        return throwError(() => new Error('Login failed. Please try again.'));
      })
    );
  }

  // Register business
  createBusiness(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register/business`, formData).pipe(
      catchError((error) => {
        console.error('Error creating business:', error);
        return throwError(() => new Error('Business registration failed.'));
      })
    );
  }
}