import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth } from '@angular/fire/auth';
import { AuthService } from '../shared/auth.service';
import { Chat } from 'src/models/chat.class';
import { ChatUser } from 'src/models/chatuser.class';

@Component({
  selector: 'app-dialog-create-chat',
  templateUrl: './dialog-create-chat.component.html',
  styleUrls: ['./dialog-create-chat.component.scss']
})
export class DialogCreateChatComponent {

  constructor(public dialogRef: MatDialogRef<DialogCreateChatComponent>, private firestore: AngularFirestore, private auth: AuthService) { }


  loading = false;
  // chat = new Chat();
  users = [];
  allChatUsers = '';
  user = new Chat();

  async ngOnInit(): Promise<void> {
    await this.loadUsers();
  }


  loadUsers(){
    this.loading = true;
    this.firestore
    .collection('users') // Ummünzen aus Users
    .valueChanges({ idField: 'userId' })
    // .add(this.chat.toJSON()); // Ummünzen aus Users
    .subscribe((chatId: any) => {
      console.log('User ID is:', chatId);
      this.users = chatId;
    });
  }

  startChat(){
    this.loading = true;
    this.firestore
    .collection('users')
    .add(this.user.toJSON());
    this.loading = false;
    console.log('This chat has been created with this user:', this.user);
    this.dialogRef.close();
  }

  checkUser(i: any) {
    console.log('User name is:', i['userName']);
  }

}
