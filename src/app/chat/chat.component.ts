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
  @Input() inputFromParentChatArray: {
    chatId: string;
    userEmail: string;
    userMessage: string;
    userMessageDate: string;
    userMessageTime: string;
    userName: string;
    channelId: string;
    userNameOfMessage: string;
    userPic: string;
  }[] = [];

  componentData: any;
  allChatChannel = '';
  users = [];
  userId: string = '';
  user: ChatUser = new ChatUser();
  textInput: HTMLTextAreaElement | undefined;

  ngOnInit(): void {
    // this.channels = window.history.state.data;
    // this.loadChat();

    console.log('inputFromParentChannelChatArray:', this.inputFromParentChatArray)
    let modifiedInputFromParentChatArray = this.inputFromParentChatArray.map(chat => {
      return {
        userPic: chat.userPic,
        userNameOfMessage: chat.userNameOfMessage,
        userMessage: chat.userMessage,
        userMessageDate: chat.userMessageDate,
        userMessageTime: chat.userMessageTime,
        userName: chat.userName,
        userEmail: chat.userEmail,
        chatId: chat.chatId
      };
    });
    console.log('modifiedInputFromParentChatArray:', modifiedInputFromParentChatArray)
  }


  sendMessageToChannel() {
    const element = document.getElementById('post-inputfield') as HTMLTextAreaElement;
    console.log(document.getElementById('post-inputfield'));

    const data = {
      userMessage: element.value,
      // userName: 'Guest', // must be changed to the current user!!
      userMessageDate: new Date().toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'}),
      userMessageTime: new Date().getTime().toString(),
    };

    const dataWithChannelId = {  // diese Variable is separiert, damit sie nicht mit den anderen Daten von const data mitgesendet wird;
      channelId: this.inputFromParentChatArray[0].channelId,
      userName: this.inputFromParentChatArray[0].userName
    }

    let timestamp = data.userMessageTime;
    let date = new Date(Number(timestamp));
    let formattedTimestamp = date.getTime().toString();
    let formattedTime = date.toLocaleTimeString('en-GB');
    data.userMessageTime = formattedTime;


    if (element.value.length == 0) { // the inputfield/textarea should not be empty
      alert('Please enter a message.');
    } else {
      this.textInput = element;
      this.firestore
        .collection('channels')
        .doc(dataWithChannelId.channelId)
        .collection('threads')
        .add(data);
        element.value = '';
      alert('SAVE TO THE FIRESTORE');
    }
  }

  // es fehlt: automatisches Refreshen nach dem Subscriben bei Value Changes im Channel

}
