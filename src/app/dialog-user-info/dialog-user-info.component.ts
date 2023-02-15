import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-user-info',
  templateUrl: './dialog-user-info.component.html',
  styleUrls: ['./dialog-user-info.component.scss']
})
export class DialogUserInfoComponent {

  email: string = '';
  emailForm = new FormControl('', [Validators.required, Validators.email]);
  usernameForm = new FormControl('', [Validators.required, Validators.minLength(2)]);


  constructor(public dialog: MatDialog) { }

  openDialog() {
    this.dialog.open(DialogUserInfoComponent);
  }


}