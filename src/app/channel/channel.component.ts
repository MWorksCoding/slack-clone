import { Component, ElementRef, Output, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../shared/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Input } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent {
  componentData: any;

  constructor(public dialog: MatDialog, private auth: AuthService, private firestore: AngularFirestore, private route: ActivatedRoute) { // Zugriff auf Firestore, Abonnieren in dieser Komponente
  }



  @ViewChild('postTextarea') postTextarea: ElementRef | undefined;

  @Input() inputFromParent: string = "";
  @Input() inputFromParentDescriptiont: string = "";
  @Input() inputFromParentChatUserName: string = "";
  @Input() inputFromParentChannelArray: {
    channelName: string;
    description: string;
    userMessage: string;
    userMessageDate: string;
    userMessageTime: string;
    userName: string;
    channelId: string;
  }[] = [];
  textInput: HTMLTextAreaElement | undefined;


  public inputFromParentChannelArray$ = new BehaviorSubject<any>(null);


  ngOnInit(): void {
        this.inputFromParentChannelArray.map(channel => {
          return {
            channelName: channel.channelName,
            description: channel.description,
            userMessage: channel.userMessage,
            userMessageDate: channel.userMessageDate,
            userMessageTime: channel.userMessageTime,
            userName: channel.userName,
            channelId: channel.channelId
          };
        });
    }

  sendMessageToChannel() {
        const element = document.getElementById('post-inputfield') as HTMLTextAreaElement;
        // console.log(document.getElementById('post-inputfield'));

        const data = {
          userMessage: element.value,
          userName: this.auth.currentUserName ?? 'Guest', // must be changed to the current user!!
          userMessageDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          userMessageTime: new Date().getTime().toString(),
        };

        const dataWithChannelId = {  // diese Variable is separiert, damit sie nicht mit den anderen Daten von const data mitgesendet wird;
          channelId: this.inputFromParentChannelArray[0].channelId
        }

    let timestamp = data.userMessageTime;
        let date = new Date(Number(timestamp));
        let formattedTimestamp = date.getTime().toString();
        let formattedTime = date.toLocaleTimeString('en-GB');
        data.userMessageTime = formattedTime;


        if(element.value.length == 0) { // the inputfield/textarea should not be empty
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
      this.inputFromParentChannelArray$.next(data);
      console.log('data', data);
    }
  }


  /**
   * clear the value from the textarea field
   */
  clearTextarea() {
    if (this.postTextarea)
      this.postTextarea.nativeElement.value = '';
  }

  // es fehlt: automatisches Refreshen nach dem Subscriben bei Value Changes im Channel

}