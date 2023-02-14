import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth } from '@angular/fire/auth';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-dialog-create-chat',
  templateUrl: './dialog-create-chat.component.html',
  styleUrls: ['./dialog-create-chat.component.scss']
})
export class DialogCreateChatComponent {

  constructor(public dialogRef: MatDialogRef<DialogCreateChatComponent>, private firestore: AngularFirestore, private auth: AuthService) { }


  loading = false;
  // chat = new Chat();

  startChat(){
    this.loading = true;
    this.firestore
    // .collection('channels') // Ummünzen aus Users
    // .add(this.chat.toJSON()); // Ummünzen aus Users
    // this.loading = false;
    this.dialogRef.close();
  }
}
