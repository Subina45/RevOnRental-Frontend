import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private BusinessId: string | null = null;

  constructor() {}

  setBusinessId(id: string): void {
    this.BusinessId = id;
  }

  getBusinessId(): string | null {
    return this.BusinessId;
  }
}
