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
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  componentData: any;
  document: any;
  userMessage: any;
  sortedMessages$: Observable<any[]> | undefined; // ***
  textInput: HTMLTextAreaElement | undefined;
  messageId!: string; // ***

  constructor(
    public dialog: MatDialog,
    public auth: AuthService,
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
  ) {
  }

  @ViewChild('postTextareaDirectMessages') postTextareaDirectMessages: ElementRef | undefined;
  @Input() allDirectMessages$: Observable<any[]> | undefined; //Observable that displays each message in Chat
  @Input() inputFromParentChat: string = '';
  @Input() inputFromParentChatUserId: string = '';
  @Output() postChannelNameEvent = new EventEmitter<string>();


  ngOnInit(): void { // ungelöst: Sortieren der Nachrichten nach Datum
    console.log('messageId?', this.messageId)
    this.allDirectMessages$?.pipe(
      map((messages) => messages.sort((a, b) => {
        const dateA = new Date(a.userMessageDate);
        const dateB = new Date(b.userMessageDate);
        return dateA.getTime() - dateB.getTime();
      }))
    );
  }


  /**
   * Saving the entry to the firestore after clicking the the send-logo
   */
  sendMessageToChat() {
    const element = document.getElementById('post-inputfield-directmessages') as HTMLTextAreaElement;
    let date = new Date();
    const data = {
      userMessage: element.value,
      userName: this.auth.currentUserName,
      userMessageDate: date.getDate().toString().padStart(2, '0') + '/' + (date.getMonth() + 1).toString().padStart(2, '0') + '/' + date.getFullYear(),
      userMessageTime: date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0')
    };
    const dataWithChatId = { userId: this.inputFromParentChatUserId }; // this variable is separated to get exclusiv access to it
    if (element.value.length == 0) { // the inputfield/textarea should not be empty
      this.dialog.open(DialogErrorEmptyMessageComponent);
    } else {
      this.textInput = element;
      this.firestore
        .collection('users')
        .doc(dataWithChatId.userId)
        .collection('messages')
        .add(data)
      element.value = '';
    }
    this.postChannelNameEvent.emit(this.inputFromParentChat); // refreshing the page instandly
    console.log('whats inside of inputFromParentChat?', this.inputFromParentChat) // cam
  }


  /**
   * delete the choosen message, messageId will be deleted
   */
  deleteMessage(i: any) {
    let threadRef = this.firestore
      .collection('users')
      .doc(this.inputFromParentChatUserId)
      .collection('messages')
      .doc(i);
    threadRef.delete()
    this.postChannelNameEvent.emit(this.inputFromParentChat); // refreshing the page instandly
  }


  /**
   * clear the value from the textarea field
   */
  clearTextarea() {
    if (this.postTextareaDirectMessages) this.postTextareaDirectMessages.nativeElement.value = '';
  }


  /**
   * opens the dialog for edtiting a message, pushes userMessage + messageId into the dialog component at injection
   * if the user push 'Ok' in the dialog, it runs the function sendEditedMessageToChat() with the parameter (data)
   * otherwise (pressing 'Abort') nothing will happen.
   */
  openDialogEditMessage(chat: { userMessage: any; messageId: any; }) {
    this.dialog.open(DialogEditMessageComponent, {
      data: {
        userMessage: chat.userMessage,
        messageId: chat.messageId
      }
    }).afterClosed().subscribe(data => {
      if (data.userMessage !== undefined || '') {
        this.sendEditedMessageToChat(data)
      } else {
        this.dialog.open(DialogErrorEmptyMessageComponent);
        return;
      }
    });
  }


  /**
   * over the current userId we get the current messageID. 
   * Here we update the userMessage and create two new fields: userMessageDateUpdate + userMessageTimeUpdate to display, that changes are made.
   */
  sendEditedMessageToChat(data: any) {
    let threadRef = this.firestore
      .collection('users')
      .doc(this.inputFromParentChatUserId)
      .collection('messages')
      .doc(data.messageId); // *** Hier prüfen!!!!!!!!!!!
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
    this.postChannelNameEvent.emit(this.inputFromParentChat); // refreshing the page instandly
  }


  /**
   * opens the dialog for deleting a message, pushes i (= messageId) into the dialog component at injection
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
}
