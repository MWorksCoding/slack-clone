import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../shared/auth.service';


@Component({
  selector: 'app-dialog-user-info',
  templateUrl: './dialog-user-info.component.html',
  styleUrls: ['./dialog-user-info.component.scss']
})
export class DialogUserInfoComponent {

  updatedEmail: string = '';
  updatedUserName: string = '';
  emailForm = new FormControl('', [Validators.required, Validators.email]);
  usernameForm = new FormControl('', [Validators.required, Validators.minLength(2)]);


  constructor(public dialog: MatDialog, public auth: AuthService, public firestore: AngularFirestore) {
    this.updatedEmail = this.auth.currentEmail;
    this.updatedUserName = this.auth.currentUserName;
  }


  openDialog() {
    this.dialog.open(DialogUserInfoComponent);
  }


  updateUserInfos() {
    this.auth.updateActualEmail(this.updatedEmail, this.updatedUserName);
  }


}