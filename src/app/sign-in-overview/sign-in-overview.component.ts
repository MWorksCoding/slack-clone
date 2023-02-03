import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in-overview',
  templateUrl: './sign-in-overview.component.html',
  styleUrls: ['./sign-in-overview.component.scss']
})
export class SignInOverviewComponent {
  constructor(private router: Router) { }
  email = new FormControl('', [Validators.required, Validators.email]);


  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
}
