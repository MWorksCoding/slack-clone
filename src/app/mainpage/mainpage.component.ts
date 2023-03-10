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
import {
  BehaviorSubject,
  Observable,
  of,
  Subscriber,
  Subscription,
} from 'rxjs';
import { ThreadsComponent } from '../threads/threads.component';
import { FormControl } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';

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

  @ViewChild(ChannelComponent) channelComponent: ChannelComponent | undefined;
  // get a reference to the channel component
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger | undefined;
  @ViewChild('content') content!: ElementRef;
  @ViewChild(ThreadsComponent) threadsComponent!: ThreadsComponent;


  forChildChannelId: string = '';
  forChildChannelName: string = '';
  forChildChannelDescription: string = '';
  forChildUserName: string = '';

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
    this.auth.showActualUser();
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
            // Query the sub collections of the channel
            this.firestore
              .collection('channels')
              .doc(channel.id)
              .collection('threads')
              .get()
              .subscribe((threads: any) => {
                threads.forEach((thread: { data: () => any }) => {
                  const threadData = thread.data();
                  // Push the thread data into the array
                  this.allThreads.push({
                    ...channelData,
                    ...threadData,
                    channelId: channel.id, // DIE JEWEILIGE CHANNEL ID MUSS  MIT INS ARRAY
                  });
                  // console.log('ALLTHREADS ARE', this.allThreads)
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


  // this function transforms the name of the clicked name of the threads.component to a number, that is found in the array channels
  // From here we get the number of the array. The values from the array are handed over 
  // to the function openChannel(), important for "channelId" and "description"
  async ngAfterViewInit(): Promise<void> {
    // subscribe to the postChannelNameEvent, open the choosen channel from threads
    this.threadsComponent.postChannelNameEvent.subscribe(async (channelName: string) => {
      // set the value of this.forChildChannelName to the value of the channelName emitted from the child component
      this.forChildChannelName = channelName;
      // console.log('Channel Name in Main Component:', channelName);
      // console.log('this.channels:', this.channels);
      const channelIndex = this.channels.findIndex((channel: { channelName: string }) => channel.channelName === channelName);
      // console.log('Number for handing over', channelIndex);
      // console.log('whats inside for handing over?' , this.channels[channelIndex])
      this.openChannel(this.channels[channelIndex]);
    });
  }


  openChannel(i: any) {
    if (this.channelSubscription) {
      this.channelSubscription.unsubscribe();
    }
    this.channelComponent?.clearTextarea();
    this.forChildChannelId = i['channelId'];
    this.forChildChannelName = i['channelName']; // This variable is needed to give it to the child component, determined from html
    this.forChildChannelDescription = i['description']; // This variable is needed to give it to the child component, determined from html
    this.allThreadsArr = []; // The array is empty with every click, to take over only the needed data from the choosen channel from the array allThreads
    for (let j = 0; j < this.allThreads.length; j++) {
      const element = this.allThreads[j];
      if (this.forChildChannelName == this.allThreads[j]['channelName']) { // if the clicked channel is equal to the channelName from the array allThreads ...
        this.allThreadsArr.push(this.allThreads[j]); // ...then push all j data to the empty array allThreadsArr; data is send to child component
      }
    }
    this.channelSubscription = this.firestore
      .collection('channels')
      .doc(this.forChildChannelId)
      .collection('threads')
      .valueChanges()
      .subscribe((value) => {
        this.allThreads$.next(value);
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


  openChat(i: any) {
    // console.log('User to child-component:', i['userName'])
    this.forChildUserName = i['userName'];
    console.log('Chat User NAME BASE is:', i['userName']); // ok
    this.allChatsArr = [];
    for (let j = 0; j < this.allChats.length; j++) {
      // loop for array allThreads
      const element = this.allChats[j];
      console.log('openChat() - AllChats:', this.allChats[j]);
      if (this.forChildUserName == this.allChats[j]['userName']) {
        // if the clicked user name is equal to the username from the array allThreads ...
        this.allChatsArr.push(this.allChats[j]); // ...then push alle j data to the empty array allThreadsArr; data is send to child component
      }
      console.log('Contents of allChatsArr:', this.allChatsArr);
    }
    this.openChatWindow();
  }


  openChatWindow() {
    window.document.getElementById('chat')!.classList.remove('d-n');
    window.document.getElementById('imprint')!.classList.add('d-n');
    window.document.getElementById('channel')!.classList.add('d-n');
    window.document.getElementById('threads')!.classList.add('d-n');
    this.changeBGGray();
  }


  changeBGWhite() {
    this.content.nativeElement.style.background = '#FAFAFA';
  }

  changeBGGray() {
    this.content.nativeElement.style.background = '#EEEEEE';
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
