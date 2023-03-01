import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../shared/auth.service';
import { Channel } from 'src/models/channel.class';
import { ActivatedRoute } from '@angular/router';
import { Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent {

  constructor(public dialog: MatDialog, private auth: AuthService, private firestore: AngularFirestore, private route: ActivatedRoute) { // Zugriff auf Firestore, Abonnieren in dieser Komponente
  }

  @Input() inputFromParent: string = "";
  @Input() inputFromParentDescriptiont: string = "";
  @Input() inputFromParentChatUserName: string = "";
  @Input() inputFromParentChatArray: {
    channelName: string;
    description: string;
    userMessage: string;
    userMessageDate: string;
    userMessageTime: string;
    userName: string;
  }[] = [];
  textInput: HTMLTextAreaElement | undefined;



  ngOnInit(): void {
    console.log('IM CHANNEL CHAT ARRAY:', this.inputFromParentChatArray)
    let modifiedInputFromParentChatArray = this.inputFromParentChatArray.map(channel => {
      return {
        channelName: channel.channelName,
        description: channel.description,
        userMessage: channel.userMessage,
        userMessageDate: channel.userMessageDate,
        userMessageTime: channel.userMessageTime,
        userName: channel.userName
      };
    });
    console.log('IM CHANNEL CHAT ARRAY2:', modifiedInputFromParentChatArray)
  }

  sendMessageToChannel() {
    const element = document.getElementById('post-inputfield') as HTMLTextAreaElement;
    console.log(document.getElementById('post-inputfield'));

    const data = {
      userMessage: element.value,
      userName: 'Guest', // must be changed to the current user!!
      userMessageDate: new Date().toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'}),
      userMessageTime: new Date().getTime().toString()
    };

    let timestamp = data.userMessageTime;
    let date = new Date(Number(timestamp));
    let formattedTimestamp = date.getTime().toString();
    let formattedTime = date.toLocaleTimeString('en-GB');
    data.userMessageTime = formattedTime;


    if (element.value.length == 0) {
      alert('Please enter a message.');
    } else {
      this.textInput = element;
      this.firestore
        .collection('channels')
        // .doc(channel.id) //the id is unknown and must be found first
        // .collection('threads')
        .add(data);
      console.log('textInput is:', element)
      alert('SAVE TO THE FIRESTORE');
    }
  }

  // Abspeichern in firestore funktioniert grundsätzlich, allerdings muss noch threads gespeichert werden
  // Dazu muss die ID von dem jeweiligen Channel ebenfalls übertragen werden von der Mainpage, damit sie in der Channel Component als Variable dienen kann.

}