import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../aservice/auth.service';
import { PaymentService } from '../aservice/payment.service';
import { BusinessService } from '../aservice/business.service';
import { VehicleService } from '../aservice/vehicle.service';
declare var bootstrap: any;

interface BookingRequest {
  id: number; // Add if available in your data
  message: string;
  businessName: string;
  userName: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  misc: {
    user: {
      id: number;
      name: string;
    };
    business: {
      id: number;
      name: string;
    };
    vehicle: {
      id: number;
      name: string;
    };
    rentalId: number;
  };
  notificationType: number;
  isRead: boolean;
  createdDate: Date;
}

interface NotificationStatus {
  status: 'paid' | 'cancelled' | 'rated';
  timestamp: number;
  rating?: number;
  review?: string;
}

interface UnReadNotifications {
  unreadCount: number;
}
@Component({
  selector: 'app-usernotification',
  standalone: true,
  imports: [RouterOutlet, NgFor, CommonModule, FormsModule],
  templateUrl: './usernotification.component.html',
  styleUrl: './usernotification.component.css',
})
export class UsernotificationComponent {
  bookingRequests: BookingRequest[] = [];
  bookings: any[] = [];
  unReadNotifications: UnReadNotifications = { unreadCount: 0 };
  unreadNotifications: number = 0;
  currentAction: 'pay' | 'cancel' = 'pay';
  selectedRequest: BookingRequest | null = null;
  private modalInstance: any;
  private readonly NOTIFICATION_STATUS_KEY = 'notificationStatuses';
  constructor(
    private router: Router,
    private authService: AuthService,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private businessService: BusinessService,
    private vehicleService: VehicleService
  ) {
    this.handlePaymentCallback();
  }

  private handlePaymentCallback(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['pidx']) {
        // Extract all necessary parameters
        const pidx = params['pidx'];
        const tidx = params['tidx']; // Khalti transaction ID
        const transactionId = params['transaction_id'];
        const purchase_order_id = params['purchase_order_id']; // This should be your rentalId

        // Create payment completion payload
        const paymentData = {
          rentalId: parseInt(purchase_order_id),
          transactionId: transactionId,
          tidx: tidx,
          pidx: pidx,
        };

        // Call savePayment API
        this.paymentService.savePayment(paymentData).subscribe({
          next: (response) => {
            alert('Payment completed successfully!');
            this.ngOnInit(); // Refresh notifications
            // Optionally redirect to a success page
            this.router.navigate(['/usernotification']);
          },
          error: (error) => {
            console.error('Error saving payment:', error);
            alert('Payment verification failed. Please contact support.');
          },
        });
      }
    });
  }

  private getNotificationIdFromRentalId(rentalId: string): number | null {
    const notification = this.bookingRequests.find(
      (req) => req.misc.rentalId.toString() === rentalId
    );
    return notification ? notification.id : null;
  }

  getRatingData(
    notificationId: number
  ): { rating: number; review: string } | null {
    const status = this.getNotificationStatus(notificationId);
    if (status && status.status === 'rated') {
      return {
        rating: status.rating || 0,
        review: status.review || '',
      };
    }
    return null;
  }

  private storeNotificationStatus(
    notificationId: number,
    status: 'paid' | 'cancelled' | 'rated',
    additionalData?: { rating?: number; review?: string }
  ): void {
    const statuses = this.getStoredNotificationStatuses();
    statuses[notificationId] = {
      status,
      timestamp: Date.now(),
      ...additionalData,
    };
    localStorage.setItem(
      this.NOTIFICATION_STATUS_KEY,
      JSON.stringify(statuses)
    );
  }

  private getStoredNotificationStatuses(): Record<number, NotificationStatus> {
    const stored = localStorage.getItem(this.NOTIFICATION_STATUS_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  getNotificationStatus(notificationId: number): NotificationStatus | null {
    const statuses = this.getStoredNotificationStatuses();
    return statuses[notificationId] || null;
  }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.authService.getUserNotifications(userId).subscribe(
      (bookingRequests: BookingRequest[]) => {
        this.bookingRequests = bookingRequests;
        const paymentNotificationIds = this.bookingRequests
          .filter(
            (request) =>
              request.notificationType === 4 || request.notificationType === 3
          )
          .map((request) => request.id);

        paymentNotificationIds.forEach((notificationId) => {
          this.authService.markNotificationAsRead(notificationId).subscribe({
            next: () => {
              console.log(`Notification ${notificationId} marked as read`);
            },
            error: (error) => {
              console.error(
                `Error marking notification ${notificationId} as read:`,
                error
              );
            },
          });
        });
      },
      (error) => {
        console.error('Error fetching booking requests:', error);
      }
    );
    this.authService.markNotificationAsChangeIsNew(userId).subscribe(
      () => {
        this.updateNotificationCount();
      },
      (error) => {
        console.error('Error setting notification as new:', error);
      }
    );
  }

  getTimeDifference(createdDate: Date): string {
    const currentDate = new Date();
    const diffInMilliseconds =
      currentDate.getTime() - new Date(createdDate).getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
  }

  private updateNotificationCount(): void {
    const businessId = this.authService.getBusinessId();
    if (businessId) {
      this.authService.fetchUnReadNotificationsCount(businessId).subscribe({
        next: (response: UnReadNotifications) => {
          this.unreadNotifications = response.unreadCount;
        },
      });
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  stars = Array(5).fill(0); // Create an array for 5 stars
  rating = 0; // The currently selected rating
  hoverRatingValue = 0; // To track hover effect
  review = ''; // The review text

  setRating(value: number): void {
    console.log('value', value);
    this.rating = value; // Set the selected rating
  }

  hoverRating(value: number): void {
    this.hoverRatingValue = value; // Adjust stars on hover
    this.rating = this.hoverRatingValue || this.rating; // Keep current rating when hover ends
  }

  submitReview(request: BookingRequest): void {
    if (!request) return;

    this.authService
      .rateBusiness(
        request.misc.business.id,
        request.misc.user.id,
        this.rating,
        this.review
      )
      .subscribe({
        next: () => {
          // Store rating status
          this.storeNotificationStatus(request.id, 'rated', {
            rating: this.rating,
            review: this.review,
          });
          // Reset rating form
          this.rating = 0;
          this.review = '';
          alert('Review submitted successfully!');

          this.authService.markNotificationAsRead(request.id).subscribe({
            next: () => {
              console.log('Notification marked as read');
            },
            error: (error) => {
              console.error('Error marking notification as read');
            },
          });

          // Close modal
          const modalEl = document.getElementById('ratingModal');
          if (modalEl) {
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) {
              modal.hide();
            }
          }

          this.ngOnInit(); // Refresh notifications
        },
        error: (error) => {
          console.error('Error submitting review:', error);
          alert('Failed to submit review. Please try again.');
        },
      });
  }

  showConfirmation(request: BookingRequest, action: 'pay' | 'cancel'): void {
    this.selectedRequest = request;
    this.currentAction = action;
    this.authService.markNotificationAsRead(request.id).subscribe({
      next: () => {
        console.log('Notification marked as read');
      },
      error: (error) => {
        console.error('Error marking notification as read');
      },
    });

    const modalEl = document.getElementById('confirmationModal');
    if (modalEl) {
      this.modalInstance = new bootstrap.Modal(modalEl);
      this.modalInstance.show();
    }
  }

  confirmAction(): void {
    if (!this.selectedRequest) return;

    if (this.currentAction === 'pay') {
      this.acceptRequest(this.selectedRequest);
    } else {
      this.rejectRequest(this.selectedRequest);
    }

    // Close modal
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  private acceptRequest(request: BookingRequest): void {
    this.businessService
      .getBusinessBookings(request.misc.business.id)
      .subscribe({
        next: (bookings: any[]) => {
          const booking = bookings.find(
            (b) => b.vehicleId === request.misc.vehicle.id
          );
          if (booking) {
            this.paymentService
              .initiatePaymentApi({
                returnUrl: 'http://localhost:4200/usernotification', // Update return URL
                websiteUrl: 'http://localhost:4200/',
                amount: booking.totalPrice.toString(),
                purchaseRentalId: request.misc.rentalId.toString(),
                userId: request.misc.user.id,
                vehicleId: request.misc.vehicle.id,
                businessId: request.misc.business.id,
              })
              .subscribe({
                next: (response: any) => {
                  if (response && response.payment_url) {
                    // Open payment URL in the same window
                    window.location.href = response.payment_url;
                    // Or to open in new tab:
                    // window.open(response.payment_url, '_blank');
                  }
                },
                error: (error) => {
                  console.error('Payment initiation failed:', error);
                  alert('Failed to initiate payment. Please try again.');
                },
              });
          }
        },
        error: (error) => {
          console.error('Error fetching bookings:', error);
          alert('Error retrieving booking information.');
        },
      });
  }

  private rejectRequest(request: BookingRequest): void {
    this.authService.cancelRental(request.misc.rentalId).subscribe({
      next: () => {
        this.storeNotificationStatus(request.id, 'cancelled');
        this.bookingRequests = this.bookingRequests.filter(
          (r) => r.id !== request.id
        );
        alert('Booking request cancelled successfully!');
        window.location.reload(); // Refresh to show updated status
      },
      error: (error) => {
        console.error('Error rejecting booking request:', error);
        alert('Failed to cancel booking request');
      },
    });
  }
}
