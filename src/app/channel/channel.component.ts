import { Component, ElementRef, Output, ViewChild, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../shared/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Input } from '@angular/core';
import { async, BehaviorSubject, map, Observable, Subject, Subscription } from 'rxjs';
import { DialogDeleteMessageComponent } from '../dialog-delete-message/dialog-delete-message.component';
import { DialogEditMessageComponent } from '../dialog-edit-message/dialog-edit-message.component';
import { DialogErrorEmptyMessageComponent } from '../dialog-error-empty-message/dialog-error-empty-message.component';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent {
  componentData: any;
  document: any;
  userMessage: any;
  sortedThreads$: Observable<any[]> | undefined;
  textInput: HTMLTextAreaElement | undefined;
  threadId!: string;

  constructor(
    public dialog: MatDialog,
    public auth: AuthService,
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
  ) {
  }

  @ViewChild('postTextarea') postTextarea: ElementRef | undefined;
  @Input() allThreads$: Observable<any[]> | undefined; //Observable that displays each message in Channel
  @Input() inputFromParentChannelId: string = '';
  @Input() inputFromParent: string = '';
  @Input() inputFromParentDescriptiont: string = '';
  @Input() inputFromParentChatUserName: string = '';
  @Output() postChannelNameEvent = new EventEmitter<string>();

  ngOnInit(): void { // ungelöst: Sortieren der Nachrichten nach Datum
    this.allThreads$?.pipe(
      map((threads) => threads.sort((a, b) => {
        const dateA = new Date(a.userMessageDate);
        const dateB = new Date(b.userMessageDate);
        return dateA.getTime() - dateB.getTime();
      }))
    );
  }

  
  /**
   * Saving the entry to the firestore after clicking the the send-logo 
   */
  sendMessageToChannel() {
    const element = document.getElementById('post-inputfield') as HTMLTextAreaElement;
    let date = new Date();
    const data = {
      userMessage: element.value,
      userName: this.auth.currentUserName ?? 'Guest',
      userMessageDate: date.getDate().toString().padStart(2, '0') + '/' + (date.getMonth() + 1).toString().padStart(2, '0') + '/' + date.getFullYear(),
      userMessageTime: date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0')
    };
    const dataWithChannelId = { channelId: this.inputFromParentChannelId }; // this variable is separated to get exclusiv access to it
    if (element.value.length == 0) { // the inputfield/textarea should not be empty
      this.dialog.open(DialogErrorEmptyMessageComponent);
    } else {
      this.textInput = element;
      this.firestore
        .collection('channels')
        .doc(dataWithChannelId.channelId)
        .collection('threads')
        .add(data)
      element.value = '';
    }
    this.postChannelNameEvent.emit(this.inputFromParent); // refreshing the page instandly
    console.log('whats inside of inputFromParent?', this.inputFromParent) // Angular
  }


  /**
   * delete the choosen message, threadID will be deleted
   */
  deleteMessage(i: any) {
    // console.log('What is data?', this.allThreads$);
    console.log('what is i @ function delete chat message?', i)
    let threadRef = this.firestore
      .collection('channels')
      .doc(this.inputFromParentChannelId)
      .collection('threads')
      .doc(i);
    threadRef.delete()
    this.postChannelNameEvent.emit(this.inputFromParent); // refreshing the page instandly
  }


  /**
   * clear the value from the textarea field
   */
  clearTextarea() {
    if (this.postTextarea) this.postTextarea.nativeElement.value = '';
  }

  
  /**
   * opens the dialog for edtiting a message, pushes userMessage + threadId into the dialog component at injection
   * if the user push 'Ok' in the dialog, it runs the function sendEditedMessageToChannel() with the parameter (data)
   * otherwise (pressing 'Abort') nothing will happen.
   */
  openDialogEditMessage(channel: { userMessage: any; threadId: any; }) {
    this.dialog.open(DialogEditMessageComponent, {
      data: {
        userMessage: channel.userMessage,
        threadId: channel.threadId
      }
    }).afterClosed().subscribe(data => {
      if (data.userMessage !== undefined || '') {
        this.sendEditedMessageToChannel(data)
      } else {
        this.dialog.open(DialogErrorEmptyMessageComponent);
        return;
      }
    });
  }

  /**
   * over the current channelId we get the current threadId. 
   * Here we update the userMessage and create two new fields: userMessageDateUpdate + userMessageTimeUpdate to display, that changes are made.
   */
  sendEditedMessageToChannel(data: any) {
    let threadRef = this.firestore
      .collection('channels')
      .doc(this.inputFromParentChannelId)
      .collection('threads')
      .doc(data.threadId);
    let date = new Date();
    let MessageTimeUpdate = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0');
    let MessageDateUpdate = date.getDate().toString().padStart(2, '0') + '/' + (date.getMonth() + 1).toString().padStart(2, '0') + '/' + date.getFullYear();

    if (data.userMessage == '') {
      this.dialog.open(DialogErrorEmptyMessageComponent);
      return;
    } else {
      threadRef.update({
        userMessage: data.userMessage,
        userMessageTimeUpdate: MessageTimeUpdate,
        userMessageDateUpdate: MessageDateUpdate,
      });
    }
    this.postChannelNameEvent.emit(this.inputFromParent); // refreshing the page instandly
  }


  /**
   * opens the dialog for deleting a message, pushes i (= threadId) into the dialog component at injection
   * if the user push 'Ok' in the dialog, it runs the function deleteMessage() with the parameter (i = data)
   * otherwise (pressing 'Abort') nothing will happen.
   */
  openDialogDeleteMessage(i: any) {
    this.dialog.open(DialogDeleteMessageComponent, {
      data: i
    }).afterClosed().subscribe(data => {
      if (data !== undefined) {
        this.deleteMessage(data);
      }
    });
  }
  // ungelöst: Sortieren der Nachrichten nach Datum
  // Idee: Code verkleinern?
}