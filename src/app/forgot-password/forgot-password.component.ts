import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../shared/auth.service';
import { SignInOverviewComponent } from '../sign-in-overview/sign-in-overview.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {


  constructor(private auth: AuthService, public dialogRef: MatDialogRef<SignInOverviewComponent>) { }

  email: string = '';
  emailForm = new FormControl('', [Validators.required, Validators.email]);

  forgotPassword() {
    this.auth.forgotPassword(this.email)
    this.email = '';
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  getErrorMessageEmail() {
    if (this.emailForm.hasError('required')) {
      return 'You must enter your Email';
    }

    return this.emailForm.hasError('email') ? 'Not a valid email' : '';
  }
}
