import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../aservice/auth.service';
import { BusinessService } from '../aservice/business.service';
import { SignalrService } from '../core-services/signalr.services';
import { SideBarComponent } from '../side-bar/side-bar.component';

export interface Booking {
  id: number;
  userName: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  rentalStatus: string;
  photo: {
    fileName: string;
    contentType: string;
    fileContent: string;
  };
  photoUrl?: string;
}

interface UnReadNotifications {
  unreadCount: number;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule,SideBarComponent],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
})
export class BookingComponent {
  unReadNotifications: UnReadNotifications = { unreadCount: 0 };
  unreadNotifications: number = 0;
  bookings: Booking[] = [];
  currentBusinessId:any=null;
  currentRole:any=null;
  constructor(
    private authService: AuthService,
    private businessService: BusinessService,
    private router: Router,
    private authservice: AuthService,
    private signalRService: SignalrService,

  ) {
   
  }

  ngOnInit(): void {
    const businessId = this.authService.getBusinessId();
    if (businessId) {
      this.loadNotificationsAndBookings(businessId);
    }
  }

  private loadNotificationsAndBookings(businessId) {
    // // Load unread notifications
    // this.businessService.fetchUnReadNotificationsCount(businessId).subscribe({
    //   next: (response: UnReadNotifications) => {
    //     this.unreadNotifications = response.unreadCount;
    //   },
    //   error: (error) => {
    //     console.error('Error fetching unread count:', error);
    //   },
    // });

    // Load bookings
    this.businessService.getBusinessBookings(businessId).subscribe({
      next: (bookings: Booking[]) => {
        this.bookings = bookings.map((booking) => ({
          ...booking,
          photoUrl: `data:${booking.photo.contentType};base64,${booking.photo.fileContent}`,
        }));
      },
      error: (error) => {
        console.error('Error fetching bookings:', error);
      },
    });
  }

  onStatusChange(booking: Booking) {
    const bookingId = booking.id;
    const newStatus = booking.rentalStatus;

    switch (newStatus) {
      case 'Accepted':
        this.acceptBooking(bookingId);
        break;
      case 'Rejected':
        this.rejectBooking(bookingId);
        break;
      case 'Completed':
        this.completeBooking(bookingId);
        break;
    }
  }

  private updateNotification(bookingId): void {
    const businessId = this.authService.getBusinessId();
    if (businessId) {
      this.businessService.fetchBusinessNotifications(businessId).subscribe({
        next: (response: any) => {
          response.forEach((notification) => {
            const rentalId = notification.misc.rentalId;
            if (bookingId === rentalId) {
              this.businessService.markNotificationAsRead(notification.id).subscribe({
                next: () => {
                  console.log(`Notification ${rentalId} marked as read`);
                },
                error: (error) => {
                  console.error(
                    `Error marking notification ${rentalId} as read:`,
                    error
                  );
                },
              });
            }
          });
        },
        error: (error) => {
          console.error('Error fetching unread count:', error);
        },
      });
    }
  }

  private acceptBooking(bookingId: number) {
    this.businessService.acceptRental(bookingId).subscribe({
      next: (response) => {
        this.updateBookingStatus(bookingId, 'Accepted');
        this.updateNotification(bookingId);
      },
      error: (error) => {
        console.error('Error accepting booking:', error);
        this.revertBookingStatus(bookingId);
      },
    });
  }

  private rejectBooking(bookingId: number) {
    this.businessService.rejectRental(bookingId).subscribe({
      next: (response) => {
        this.updateBookingStatus(bookingId, 'Rejected');
        this.updateNotification(bookingId);
      },
      error: (error) => {
        console.error('Error rejecting booking:', error);
        this.revertBookingStatus(bookingId);
      },
    });
  }

  private completeBooking(bookingId: number) {
    this.businessService.completeRental(bookingId).subscribe({
      next: (response) => {
        this.updateBookingStatus(bookingId, 'Completed');
      },
      error: (error) => {
        console.error('Error completing booking:', error);
        this.revertBookingStatus(bookingId);
      },
    });
  }

  private updateBookingStatus(bookingId: number, status: string) {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (booking) {
      booking.rentalStatus = status;
    }
  }

  private revertBookingStatus(bookingId: number) {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (booking) {
      // Revert to original status
      this.loadNotificationsAndBookings(this.authService.getBusinessId());
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
