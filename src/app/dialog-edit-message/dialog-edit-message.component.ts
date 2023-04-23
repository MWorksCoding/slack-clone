import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-dialog-edit-message',
  templateUrl: './dialog-edit-message.component.html',
  styleUrls: ['./dialog-edit-message.component.scss']
})
export class DialogEditMessageComponent {

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<DialogEditMessageComponent>, private firestore: AngularFirestore, @Inject(MAT_DIALOG_DATA) public data: any) { }

  element = document.getElementById('post-inputfield') as HTMLTextAreaElement;

  onModelChange(event: any) {
    this.element = event;
    this.element = this.data;
  }
}
