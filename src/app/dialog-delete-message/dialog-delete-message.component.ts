import { Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-dialog-delete-message',
  templateUrl: './dialog-delete-message.component.html',
  styleUrls: ['./dialog-delete-message.component.scss']
})
export class DialogDeleteMessageComponent {

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<DialogDeleteMessageComponent>, private firestore: AngularFirestore, @Inject(MAT_DIALOG_DATA) public data: any) { }
  
}
