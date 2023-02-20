import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../shared/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Input } from '@angular/core';
import { ChatUser } from 'src/models/chatuser.class';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

  constructor(public dialog: MatDialog, private auth: AuthService, private firestore: AngularFirestore, private route: ActivatedRoute) { // Zugriff auf Firestore, Abonnieren in dieser Komponente
  }

  @Input() inputFromParentChat: string = "";


  allChatChannel = '';
  users = [];
  userId: string = '';
  user: ChatUser = new ChatUser();

  ngOnInit(): void {
    // this.channels = window.history.state.data;
    this.loadChat();
  }

  loadChat() {
    // this.route.params.subscribe((params => {
    //   this.channelId = params['get']('id');
       this.route.params.subscribe((params) => {
         console.log('Chat with User is:', params);
       });
    // }))
    this.firestore
      .collection('users')
      // .doc(this.channelId)
      .valueChanges()
      .subscribe((userId: any) => {
        // this.channel = new Channel(channel);
        console.log('Channel-Component: Channel ID is:', userId);
        this.users = userId;
      })
  }

}
