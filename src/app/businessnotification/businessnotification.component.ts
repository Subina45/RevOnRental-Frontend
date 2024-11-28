import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-businessnotification',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './businessnotification.component.html',
  styleUrl: './businessnotification.component.css'
})
export class BusinessnotificationComponent {

  constructor(
    private router: Router
  ){}
  navigateTo(path: string) {
    this.router.navigate([path]);
  }

}
