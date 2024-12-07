import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { BusinessService } from './business.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private businessService: BusinessService
  ) {}

  initiatePaymentApi(data: any): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const payload = {
      returnUrl: data.returnUrl,
      websiteUrl: data.websiteUrl,
      amount: data.amount,
      purchaseRentalId: data.purchaseRentalId,
      userId: data.userId,
      vehicleId: data.vehicleId,
      businessId: data.businessId,
    };

    return this.http
      .post(`${environment.API_URL}/payment`, payload, { headers })
      .pipe(
        catchError((error) => {
          console.error('Payment initiation failed:', error);
          return throwError(
            () =>
              new Error(error.error?.message || 'Payment initiation failed.')
          );
        })
      );
  }

  savePayment(data: any): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .post(`${environment.API_URL}/payment/complete`, data, {
        headers,
        responseType: 'text',
      })
      .pipe(
        map((response) => ({ message: response })),
        map((response) => {
          this.businessService.confirmRental(data.rentalId).subscribe({
            next: () => console.log('Rental confirmed.'),
            error: (error) =>
              console.error('Rental confirmation failed:', error),
          });
          return { message: response };
        }),
        catchError((error) => {
          console.error('Payment complete failed:', error);
          return throwError(
            () => new Error(error.error?.message || 'Payment complete failed.')
          );
        })
      );
  }
}
