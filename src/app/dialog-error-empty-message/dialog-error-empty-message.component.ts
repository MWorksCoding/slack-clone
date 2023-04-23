import { Component } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-dialog-error-empty-message',
  templateUrl: './dialog-error-empty-message.component.html',
  styleUrls: ['./dialog-error-empty-message.component.scss']
})
export class DialogErrorEmptyMessageComponent {

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<DialogErrorEmptyMessageComponent>, private firestore: AngularFirestore) { }

}
