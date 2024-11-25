import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }

  private availableBusinessesSubject = new BehaviorSubject<any[]>([]);
  availablebusinesses$ = this.availableBusinessesSubject.asObservable();

  setAvailableBusinesses(businesses: any[]): void {
    this.availableBusinessesSubject.next(businesses);
  }

  // Get available vehicles for BusinessListComponent
  getAvailableBusinesses(): any[] {
    return this.availableBusinessesSubject.getValue();
  }
}
