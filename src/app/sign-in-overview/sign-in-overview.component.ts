import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in-overview',
  templateUrl: './sign-in-overview.component.html',
  styleUrls: ['./sign-in-overview.component.scss']
})
export class SignInOverviewComponent {
  constructor(private router: Router) { }
}
