import { CommonModule } from '@angular/common';
import { Component,inject,OnInit, } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet,Router } from '@angular/router';
import { AuthService } from '../aservice/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';
import { LoginstateService } from '../aservice/loginstate.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive,CommonModule,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  menuOpen: boolean = false;
  isLoggedIn: boolean = false;
  

  toggleMenu(): void{
    this.menuOpen = !this.menuOpen;
  }
  constructor(
    private loginStateService: LoginstateService
  ){}
  
  ngOnInit():void {
    this.loginStateService.isLoggedIn.subscribe((status) =>{
      this.isLoggedIn = status;
    }); 
  }
  onLogout():void{
    this.loginStateService.logout();
  }
   
}

