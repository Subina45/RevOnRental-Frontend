import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vehicle } from '../viewdetailpopup/viewdetailpopup.component';  // Import your Vehicle model

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private apiUrl = 'https://localhost:7275/api/VehicleRental/business-dashboard/12'; 

  constructor(private http: HttpClient) { }

  getVehicleDetails(businessId: number, vehicleType: string): Observable<Vehicle> {
    return this.http.get<any>(`${this.apiUrl}/details?businessId=${businessId}&vehicleType=${vehicleType}`).pipe(
      map(response => {
        const vehicleSummary = response.vehicleTypeSummaries.find(
          (summary: any) => summary.vehicleType === vehicleType
        );
        return {
          brand: vehicleType,  // Since API doesn't give 'brand', assume 'vehicleType' is the brand
          model: vehicleType,  // Assuming 'vehicleType' represents the model
          totalQuantity: vehicleSummary.totalQuantity,
          available: vehicleSummary.availableQuantity > 0,
          hourlyRate: 500, // Assuming static values or pull from somewhere else
          halfDayRate: 1500, // Adjust based on your logic
          fullDayRate: 3000, // Adjust based on your logic
          photo: 'some-url-to-photo' // Adjust to actual data source for the photo
        };
      })
    );
  }
}
