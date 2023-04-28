import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateChannelComponent } from '../dialog-create-channel/dialog-create-channel.component';
import { DialogCreateChatComponent } from '../dialog-create-chat/dialog-create-chat.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatMenuTrigger } from '@angular/material/menu';
import { DialogUserInfoComponent } from '../dialog-user-info/dialog-user-info.component';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UploadServiceService } from '../shared/upload-service.service';
import { ChannelComponent } from '../channel/channel.component';
import { ChatComponent } from '../chat/chat.component';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  Subscriber,
  Subscription,
} from 'rxjs';
import { ThreadsComponent } from '../threads/threads.component';
import { FormControl } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
import firebase from 'firebase/compat';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss'],
  template: `
    <div class="mainpage">
      <child></child>
    </div>
  `,
})
export class MainpageComponent implements OnInit, OnDestroy {


  constructor(
    public dialog: MatDialog,
    public auth: AuthService,
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
    public fireauth: AngularFireAuth,
    public storage: AngularFireStorage,
    public uploadService: UploadServiceService
  ) {
    // Zugriff auf Firestore, Abonnieren in dieser Komponente
    this.forChildChannelName = '';
  }


  readonly searchTerm = new FormControl('', { nonNullable: true });

  channelSubscription: Subscription | undefined;
  allThreads$ = new BehaviorSubject<any>(null);
  directMessagesSubscription: Subscription | undefined;
  allDirectMessages$ = new BehaviorSubject<any>(null);


  @ViewChild(ChannelComponent) channelComponent: ChannelComponent | undefined; // get a reference to the channel component
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger | undefined;
  @ViewChild('content') content!: ElementRef;
  @ViewChild(ThreadsComponent) threadsComponent!: ThreadsComponent;
  @ViewChild(ChatComponent) chatComponent: ChatComponent | undefined;


  forChildChannelId: string = '';
  forChildChannelName: string = '';
  forChildChannelDescription: string = '';
  forChildUserName: string = '';

  forChildChatId: string = '';

  loading = false;
  channelId = '';
  channels = [];
  allChatChannel = '';
  users = [];
  ChannelMenuIsOpen = true;
  DirectMessagesMenuIsOpen = true;
  forChildChatUserName: string = '';
  allThreads: any[] = [];
  allThreadsArr: any[] = [];

  chatId = '';
  allChats: any[] = [];
  allChatsArr: any[] = [];

  // test user: hotid53611@fenwazi.com ; 12345678

  async ngOnInit(): Promise<void> {
    await this.auth.showActualUser();
    setTimeout(() => {
      console.log('username', this.auth.currentUserName);
    }, 2000);
    this.loadChannels();
    this.loadUsers();
    await this.loadThreads();
    this.openThreads();
    //  this.route.params.subscribe((params) => {
    //  console.log(params);
    //  });
  }


  toggleChannelMenu() {
    if (this.ChannelMenuIsOpen) {
      this.ChannelMenuIsOpen = false;
    } else {
      this.ChannelMenuIsOpen = true;
    }
  }


  toggleDirectMessagesMenu() {
    if (this.DirectMessagesMenuIsOpen) {
      this.DirectMessagesMenuIsOpen = false;
    } else {
      this.DirectMessagesMenuIsOpen = true;
    }
  }


  openDialogCreateChannel() {
    this.dialog.open(DialogCreateChannelComponent);
  }


  openDialogCreateChat() {
    this.dialog.open(DialogCreateChatComponent);
  }


  loadChannels() {
    this.loading = true;
    this.firestore
      .collection('channels')
      .valueChanges({ idField: 'channelId' })
      .subscribe((channelId: any) => {
        console.log('Mainpage: Channel ID is:', channelId);
        this.channels = channelId;
      });
  }


  async loadThreads() {
    await this.firestore
      .collection('channels')
      .get()
      .subscribe((channels: any) => {
        channels.forEach(
          (channel: { data: () => any; id: string | undefined }) => {
            const channelData = channel.data();
            this.firestore // Query the sub collections of the channel
              .collection('channels')
              .doc(channel.id)
              .collection('threads')
              .get()
              .subscribe((threads: any) => {
                threads.forEach((thread: { data: () => any; id: string | undefined }) => {
                  const threadData = thread.data();
                  this.allThreads.push({ // Push the thread data into the array
                    ...channelData,
                    ...threadData,
                    channelId: channel.id, // DIE JEWEILIGE CHANNEL ID MUSS  MIT INS ARRAY
                    threadId: thread.id, // DIE JEWEILIGE Thread ID MUSS  MIT INS ARRAY
                  });
                  console.log('ALLTHREADS ARE', this.allThreads)
                });
                this.openThreads(); // place openThreads here to show it automatically after log in
              });
          }
        );
      });
  }


  loadUsers() {
    this.loading = true;
    this.firestore
      .collection('users')
      .valueChanges({ idField: 'userId' })
      .subscribe((chatId: any) => {
        // console.log('User ID is:', chatId);
        this.users = chatId;
      });
  }


  async loadUserChats() {
    await this.firestore
      .collection('users')
      .get()
      .subscribe((users: any) => {
        users.forEach((chatId: { data: () => any; id: string | undefined }) => {
          const channelData = chatId.data();
          // Query the sub collections of the channel
          this.firestore
            .collection('users')
            .doc(chatId.id)
            .collection('chats')
            .get()
            .subscribe((chats: any) => {
              chats.forEach((chat: { data: () => any }) => {
                const threadData = chat.data();
                // Push the thread data into the array
                this.allChats.push({
                  ...channelData,
                  ...threadData,
                  chatId: chatId.id, // DIE JEWEILIGE ID MUSS  MIT INS ARRAY
                });
                console.log('ALL CHATS ARE', this.allChats);
              });
              // this.openThreads(); // place openThreads here to show it automatically after log in
            });
        });
      });
  }


  openImprint() {
    window.document.getElementById('imprint')!.classList.remove('d-n');
    window.document.getElementById('threads')!.classList.add('d-n');
    window.document.getElementById('channel')!.classList.add('d-n');
    window.document.getElementById('chat')!.classList.add('d-n');
    this.changeBGWhite();
  }


  openThreads() {
    this.allThreadsArr = []; // The array is empty with every click, to take over only the needed data from the choosen channel from the array allThreads
    let currentUser = 'Guest'; // !!!Change this variable to the current user later!!!
    for (let j = 0; j < this.allThreads.length; j++) {
      const element = this.allThreads[j];
      if (currentUser == this.allThreads[j]['userName']) {
        this.allThreadsArr.push(this.allThreads[j]);
      }
    }
    this.openThreadsWindow();
  }


  openThreadsWindow() {
    window.document.getElementById('threads')!.classList.remove('d-n');
    window.document.getElementById('imprint')!.classList.add('d-n');
    window.document.getElementById('channel')!.classList.add('d-n');
    window.document.getElementById('chat')!.classList.add('d-n');
    this.changeBGWhite();
  }


  /**
  * this function transforms the name of the clicked name of the threads.component / channel.component to a number, that is found in the array channels
  * From here we get the number of the array. The values from the array are handed over to the function openChannel(), important for "channelId" and "description"
  */
  async ngAfterViewInit(): Promise<void> {
    this.threadsComponent.postChannelNameEvent.subscribe(async (channelName: string) => { // subscribe to the postChannelNameEvent, open the choosen channel from threads /channels
      this.forChildChannelName = channelName;
      const channelIndex = this.channels.findIndex((channel: { channelName: string }) => channel.channelName === channelName); // set the value of this.forChildChannelName to the value of the channelName emitted from the child component
      this.openChannel(this.channels[channelIndex]);
    });
    this.channelComponent?.postChannelNameEvent.subscribe(async (inputFromParent: string) => {
      this.forChildChannelName = inputFromParent;
      const channelIndex = this.channels.findIndex((channel: { channelName: string }) => channel.channelName === inputFromParent);
      this.openChannel(this.channels[channelIndex]);
    });
    this.chatComponent?.postChannelNameEvent.subscribe(async (inputFromParentChat: string) => {
      this.forChildChannelName = inputFromParentChat;
      const chatIndex = this.users.findIndex((chat: { userName: string }) => chat.userName === inputFromParentChat);
      this.openDirectMessages(this.users[chatIndex]);
    });
  }


  async openChannel(i: any) {
    if (this.channelSubscription) {
      this.channelSubscription.unsubscribe();
    }
    this.channelComponent?.clearTextarea();
    this.forChildChannelId = i['channelId'];
    this.forChildChannelName = i['channelName']; // This variable is needed to give it to the child component, determined from html
    this.forChildChannelDescription = i['description']; // This variable is needed to give it to the child component, determined from html
    this.channelSubscription = await this.firestore // Get the certain threadID in allThreads$
      .collection('channels')
      .doc(this.forChildChannelId)
      .collection('threads')
      .get()
      .subscribe((value) => {
        const threads: firebase.firestore.DocumentData[] = [];
        value.forEach(doc => {
          const thread = doc.data();
          thread['threadId'] = doc.id;
          threads.push(thread);
          // Sort the threads by date, the time is missing (userMessageTime)
          threads.sort((a, b) => {
            const dateA = new Date(a['userMessageDate'].split('/').reverse().join('-'));
            const dateB = new Date(b['userMessageDate'].split('/').reverse().join('-'));
            return dateB.getTime() - dateA.getTime();
          });
          // Sort the threads by date, the time is missing (userMessageTime)
        });
        this.allThreads$.next(threads);
      });
    this.openChannelWindow();
  }


  openChannelWindow() {
    window.document.getElementById('channel')!.classList.remove('d-n');
    window.document.getElementById('imprint')!.classList.add('d-n');
    window.document.getElementById('threads')!.classList.add('d-n');
    window.document.getElementById('chat')!.classList.add('d-n');
    this.changeBGWhite();
  }


  openDirectMessages(i: any) {
    if (this.directMessagesSubscription) {
      this.directMessagesSubscription.unsubscribe();
    }
    this.chatComponent?.clearTextarea();
    this.forChildChatId = i['userId'];
    this.forChildUserName = i['userName'];
    this.directMessagesSubscription = this.firestore // Get the certain threadID in allThreads$
      .collection('users')
      .doc(this.forChildChatId)
      .collection('messages')
      .get()
      .subscribe((value) => {
        const messages: firebase.firestore.DocumentData[] = [];
        value.forEach(doc => {
          const message = doc.data();
          message['messageId'] = doc.id;
          messages.push(message);
          // Sort the threads by date, the time is missing (userMessageTime)
          messages.sort((a, b) => {
            const dateA = new Date(a['userMessageDate'].split('/').reverse().join('-'));
            const dateB = new Date(b['userMessageDate'].split('/').reverse().join('-'));
            return dateB.getTime() - dateA.getTime();
          });
          // Sort the threads by date, the time is missing (userMessageTime)
        });
        this.allDirectMessages$.next(messages);
      });
    this.openDirectMessagesWindow();
  }


  openDirectMessagesWindow() {
    window.document.getElementById('chat')!.classList.remove('d-n');
    window.document.getElementById('imprint')!.classList.add('d-n');
    window.document.getElementById('channel')!.classList.add('d-n');
    window.document.getElementById('threads')!.classList.add('d-n');
    this.changeBGGray();
  }


  changeBGWhite() {
    this.content.nativeElement.style.background = '#FAFAFA';
    window.document.getElementById('bg-change')!.style.backgroundColor = '#FAFAFA';
  }

  changeBGGray() {
    this.content.nativeElement.style.background = '#EEEEEE';
    window.document.getElementById('bg-change')!.style.backgroundColor = '#EEEEEE';
  }


  /**
   * opens dialog if user is not logged in as Guest, else info appears for 2 seconds
   */
  async openDialogUserInfo() {
    const user = await this.fireauth.currentUser;
    if (!user?.isAnonymous) { //only open dialog if user is registered
      const dialogRef = this.dialog.open(DialogUserInfoComponent);
    } else {
      document
        .getElementById('only-for-registered-user')
        ?.classList.remove('d-n');
      setTimeout(() => {
        document
          .getElementById('only-for-registered-user')
          ?.classList.add('d-n');
      }, 2000);
    }
  }


  /**
   * sign out function in auth service will be called and unsubscribe from observables
   */
  signOut() {
    this.auth.signOut();
    this.auth.unsubscribe();
  }

  ngOnDestroy(): void { }
}

function getDocs(subColRef: (val: any) => void) {
  throw new Error('Function not implemented.');
}

function tap(
  arg0: (roles: any) => void
): import('rxjs').OperatorFunction<unknown, unknown> {
  throw new Error('Function not implemented.');
}

function combineLatest(arg0: any) {
  throw new Error('Function not implemented.');
}



// to do: Funktionen durchgehen, was kann man weglassen / vereinfachen?