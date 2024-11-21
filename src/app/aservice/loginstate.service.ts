import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginstateService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn = this.loggedIn.asObservable();

  setLoginStatus(status: boolean): void{
    this.loggedIn.next(status);
  }
  logout(): void{
    this.loggedIn.next(false);
  }

  constructor() { }
}

