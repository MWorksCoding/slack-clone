import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, } from '@angular/fire/compat/storage';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../shared/auth.service';
import { SpinnerService } from '../shared/spinner.service';
import { UploadServiceService } from '../shared/upload-service.service';


@Component({
  selector: 'app-dialog-user-info',
  templateUrl: './dialog-user-info.component.html',
  styleUrls: ['./dialog-user-info.component.scss']
})
export class DialogUserInfoComponent {


  emailForm = new FormControl(this.auth.currentEmail, [Validators.required, Validators.email]);
  usernameForm = new FormControl(this.auth.currentUserName, [Validators.required, Validators.minLength(2)]);


  constructor(public auth: AuthService, public spinnerService: SpinnerService, public uploadService: UploadServiceService) { }

  
  /**
   *checks if user name is valid, else it returns an info 
   * @returns info for user if user name is invalid
   */
  getErrorMessageUsername() {
    if (this.usernameForm.hasError('required'))
      return 'You must enter a Username'
    return this.usernameForm.hasError('minlength') ? 'Not a valid username' : '';
  }

  /**
   *checks if email is valid, else it returns an info 
   * @returns info for user if email is invalid
   */
  getErrorMessageEmail() {
    if (this.emailForm.hasError('required'))
      return 'You must enter your Email';
    return this.emailForm.hasError('email') ? 'Not a valid email' : '';
  }

  /**
   * updates the email and the username
   */
  updateUserInfos() {
    this.auth.updateEmailAndName(this.emailForm.value, this.usernameForm.value);
  }
}





