import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-dialog-create-chat',
  templateUrl: './dialog-create-chat.component.html',
  styleUrls: ['./dialog-create-chat.component.scss']
})
export class DialogCreateChatComponent {

  constructor(public dialogRef: MatDialogRef<DialogCreateChatComponent>, private firestore: AngularFirestore) { }


  loading = false;
  // chat = new Chat();

  ngOnInit(): void {
    this.firestore
    .collection('channels') // Ummünzen aus Users
    .valueChanges({ idField: 'channelId' }) // Ummünzen aus Users
    .subscribe();
  }

  startChat(){
    this.loading = true;
    this.firestore
    // .collection('channels') // Ummünzen aus Users
    // .add(this.chat.toJSON()); // Ummünzen aus Users
    // this.loading = false;
    this.dialogRef.close();
  }
}
