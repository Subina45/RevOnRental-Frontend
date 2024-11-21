import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenKey = 'authToken'; // Key to store token in localStorage
  private readonly apiUrl = 'http://localhost:5199/api/Auth'; // Base API URL

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

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken(); // Returns true if token exists
  }

  createUser(signupObj:any): Observable<any>{
    return this.http.post(`${this.apiUrl}/register/user`,signupObj,{
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text' // to handle non-JSON responses (Expecting text response from the server)
    })
  }

  loginUser(loginObj:any): Observable<any>{
    return this.http.post(`${this.apiUrl}/login`,loginObj,{
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'json'

    })
  }


  createBusiness(businessData:FormData): Observable<any>{

    return this.http.post(`${this.apiUrl}/register/business`,businessData,{
      // headers: new HttpHeaders({
      //   // 'Content-Type': 'application/json'
      //   responseType: 'json'
      // }),
      

    });
   
  
  }
}

