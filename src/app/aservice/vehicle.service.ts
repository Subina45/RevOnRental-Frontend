import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service'; // Import AuthService
// import { Vehicle } from '../viewdetailpopup/viewdetailpopup.component';  // Import your Vehicle model

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private readonly apiUrl = environment.API_URL; // Base API URL

  constructor(
    private http: HttpClient,
    private authService: AuthService

  ) { }

  addVehicle(formData: FormData): Observable<any> {

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

    // Include the headers in the options parameter
    return this.http.post(`${this.apiUrl}/Vehicle/add`, formData, { headers }).pipe(
      catchError((error) => {
        console.error('Error adding vehicle:', error);
        return throwError(() => new Error('Vehicle registration failed.'));
      })
    );
  }


  getBusinessDashboard(businessId: number): Observable<any> {

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
    return this.http.get(`${this.apiUrl}/VehicleRental/business-dashboard/${businessId}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching business dashboard data:', error);
        return throwError(() => new Error('Failed to fetch business dashboard data.'));
      })
    );
  }

  getVehicleDetails(businessId: number, vehicleType: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No authentication token found.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    // Set headers for the request
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Create the request body as expected by the backend
    const requestBody = {
      businessId: businessId,
      vehicleType: vehicleType
    };

    // Use HttpRequest to create a GET request manually with the body
    const req = new HttpRequest('GET', `${this.apiUrl}/VehicleRental/vehicle-type-details`, requestBody, {
      headers: headers,
      responseType: 'json'
    });

    // Use http.request to send the request
    return this.http.request(req)
      .pipe(
        catchError((error) => {
          console.error('Error fetching vehicle details:', error);
          return throwError(() => new Error('Failed to fetch vehicle details.'));
        })
      );
  }
}