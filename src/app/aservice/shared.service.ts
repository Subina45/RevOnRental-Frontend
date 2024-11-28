import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private searchResults: any[] = [];
  private searchDetails: any = {};

  // Set search data
  setSearchData(results: any[], details: any): void {
    this.searchResults = results;
    this.searchDetails = details;
  }

  // Get search results
  getSearchResults(): any[] {
    return this.searchResults;
  }

  // Get search details
  getSearchDetails(): any {
    return this.searchDetails;
  }
}
