import { Component, EventEmitter, Output } from '@angular/core';
import { SignalrService } from '../core-services/signalr.services';
import { AuthService } from '../aservice/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedServiceService } from '../aservice/shared-service.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  unreadNotifications: number = 0;
  currentBusinessId:any=null;
  currentRole:any=null;
  @Output('parentFun') parentFun: EventEmitter<any> = new EventEmitter();

constructor(
    private authservice: AuthService,
    private signalRService: SignalrService,
        private router: Router,
        private sharedService:SharedServiceService
    

  ) {
    this.currentRole=this.authservice.getLoggedInRole()?.toLowerCase();
    this.signalRServiceListners();
    this.signalRService.onNotificationCreateSignal();
    if(this.currentRole=='business'){
      this.currentBusinessId=this.authservice.getBusinessId();
      this.getNotificationCount(this.currentBusinessId);
      
    }
  }

  
    private signalRServiceListners() {
      this.signalRService.onCreateNotification$.subscribe((respo: any) => {
          if (respo) {   
            if(this.currentRole=='business'){
              this.getNotificationCount(this.currentBusinessId);
              if(this.router.url.includes('/businessnotification')){
                this.parentFun.emit();
              }
            }
          }
      });
  }
    getNotificationCount(id){
      this.authservice.fetchUnReadNotificationsCount(id).subscribe({
        next: (response: any) => {
         
          this.unreadNotifications = response.unreadCount;
          console.log('Unread notifications:', this.unreadNotifications);
        },
        error: (error) => {
          console.error('Error fetching unread count:', error);
        },
      });
    }

    navigateTo(path: string) {
      debugger;
      this.unreadNotifications=0;
      this.router.navigate([path]);
    }

    updateNotificationCount(){
      
    }
}
