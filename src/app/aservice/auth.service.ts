import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
// import * as jwt_decode from 'jwt-decode';
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenKey = 'authToken'; // Key to store token in localStorage
  private readonly apiUrl = environment.API_URL; // Base API URL
  constructor(private http: HttpClient) { }

   // Save token in localStorage
   setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Retrieve token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Remove token
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // This is to decode JWT token
  decodeToken() {
    const token = this.getToken();
    if (token) {
      return jwt_decode(token);

    }
}

getLoggedInRole(){
  const token=this.decodeToken();
  if(token){
    return token.role().toLowerCase();
  }
}

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken(); // Returns true if token exists
  }

  createUser(signupObj:any): Observable<any>{
    return this.http.post(`${this.apiUrl}/auth/register/user`,signupObj)
  }

  loginUser(loginObj:any): Observable<any>{
    return this.http.post(`${this.apiUrl}/auth/login`,loginObj)
  }


  createBusiness(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register/business`, formData);
  }

  
}

