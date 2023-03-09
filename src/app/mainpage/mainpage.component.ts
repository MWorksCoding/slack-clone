import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateChannelComponent } from '../dialog-create-channel/dialog-create-channel.component';
import { DialogCreateChatComponent } from '../dialog-create-chat/dialog-create-chat.component';
import { AngularFirestore, fromCollectionRef } from '@angular/fire/compat/firestore';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatMenuModule } from '@angular/material/menu';
import { DialogUserInfoComponent } from '../dialog-user-info/dialog-user-info.component';
import { Channel } from 'src/models/channel.class';
import { ChannelComponent } from '../channel/channel.component';
import { ActivatedRoute } from '@angular/router';
import { user } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Threads } from 'src/models/threads.class';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FirebaseError } from 'firebase/app';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent implements OnInit {
  constructor(public dialog: MatDialog, public auth: AuthService, private firestore: AngularFirestore, private route: ActivatedRoute,
    public fireauth: AngularFireAuth, public storage: AngularFireStorage) { // Zugriff auf Firestore, Abonnieren in dieser Komponente
  }


  imagePath: any = '';

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger | undefined;
  @ViewChild('content') content!: ElementRef;


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

  chatId ='';
  allChats: any[] = [];
  allChatsArr: any[] = [];



  async ngOnInit(): Promise<void> {
    this.imagePath = this.storage.ref(`users/${this.auth.currentUserId}/profile-picture`);
    let profilPicture = document.getElementById('profile-picture') as HTMLImageElement;
    if (profilPicture) {
      profilPicture.src = this.imagePath.getDownloadURL();
    }
    await this.loadChannels();
    await this.loadUsers();
    await this.loadThreads();
    await this.openThreads();
    await this.loadUserChats();

    await this.auth.showActualUser();
    //  this.route.params.subscribe((params) => {
    //  console.log(params);
    //  });
  }


  toggleChannelMenu() {
    if (this.ChannelMenuIsOpen) {
      this.ChannelMenuIsOpen = false;
    }
    else {
      this.ChannelMenuIsOpen = true;
    }
  }


  toggleDirectMessagesMenu() {
    if (this.DirectMessagesMenuIsOpen) {
      this.DirectMessagesMenuIsOpen = false;
    }
    else {
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
        // console.log('Mainpage: Channel ID is:', channelId);
        this.channels = channelId;
      });
    ;
  }


  async loadThreads() {
    await this.firestore
      .collection('channels')
      .get()
      .subscribe((channels: any) => {
        channels.forEach((channel: { data: () => any; id: string | undefined; }) => {
          const channelData = channel.data();
          // Query the sub collections of the channel
          this.firestore
            .collection('channels')
            .doc(channel.id)
            .collection('threads')
            .get()
            .subscribe((threads: any) => {
              threads.forEach((thread: { data: () => any; }) => {
                const threadData = thread.data();
                // Push the thread data into the array
                this.allThreads.push({
                  ...channelData,
                  ...threadData,
                  channelId: channel.id // DIE JEWEILIGE CHANNEL ID MUSS  MIT INS ARRAY
                });
                // console.log('ALLTHREADS ARE', this.allThreads)
              });
              this.openThreads(); // place openThreads here to show it automatically after log in
            });
        });
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

// *******************************************************************************
  async loadUserChats() {
    await this.firestore
      .collection('users')
      .get()
      .subscribe((users: any) => {
        users.forEach((chatId: { data: () => any; id: string | undefined; }) => {
          const channelData = chatId.data();
          // Query the sub collections of the channel
          this.firestore
            .collection('users')
            .doc(chatId.id)
            .collection('chats')
            .get()
            .subscribe((chats: any) => {
              chats.forEach((chat: { data: () => any; }) => {
                const threadData = chat.data();
                // Push the thread data into the array
                this.allChats.push({
                  ...channelData,
                  ...threadData,
                  chatId: chatId.id // DIE JEWEILIGE ID MUSS  MIT INS ARRAY
                });
                console.log('ALL CHATS ARE', this.allChats)
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
    for (let j = 0; j < this.allThreads.length; j++) { // loop for array allThreads
      const element = this.allThreads[j];
      if (currentUser == this.allThreads[j]['userName']) { // current User ('guest') is part of the array allThreads, then
        this.allThreadsArr.push(this.allThreads[j]) // ...then push all j data to the empty array allThreadsArr; data is send to child component
      }
    }
    window.document.getElementById('threads')!.classList.remove('d-n');
    window.document.getElementById('imprint')!.classList.add('d-n');
    window.document.getElementById('channel')!.classList.add('d-n');
    window.document.getElementById('chat')!.classList.add('d-n');
    this.changeBGWhite();
  }


  openChannel(i: any) {
    this.forChildChannelName = i['channelName']; // This variable is needed to give it to the child component, determined from html
    // console.log('Chat CHANNEL NAME BASE is:', i['channelName'])
    this.forChildChannelDescription = i['description']; // This variable is needed to give it to the child component, determined from html
    this.allThreadsArr = []; // The array is empty with every click, to take over only the needed data from the choosen channel from the array allThreads
    for (let j = 0; j < this.allThreads.length; j++) { // loop for array allThreads
      const element = this.allThreads[j];
      // console.log('openChannel() - AllThreads:', this.allThreads[j])
      if (this.forChildChannelName == this.allThreads[j]['channelName']) { // if the clicked channel is equal to the channelName from the array allThreads ...
        this.allThreadsArr.push(this.allThreads[j]) // ...then push alle j data to the empty array allThreadsArr; data is send to child component
      }
      console.log('Contents of allThreadsArr:', this.allThreadsArr);
    }
    window.document.getElementById('channel')!.classList.remove('d-n');
    window.document.getElementById('imprint')!.classList.add('d-n');
    window.document.getElementById('threads')!.classList.add('d-n');
    window.document.getElementById('chat')!.classList.add('d-n');
    this.changeBGWhite();
  }


  openChat(i: any) {
    // console.log('User to child-component:', i['userName'])
    this.forChildUserName = i['userName'];
    console.log('Chat User NAME BASE is:', i['userName']) // ok
    this.allChatsArr = [];
    for (let j = 0; j < this.allChats.length; j++) { // loop for array allThreads
      const element = this.allChats[j];
      console.log('openChat() - AllChats:', this.allChats[j])
      if (this.forChildUserName == this.allChats[j]['userName']) { // if the clicked user name is equal to the username from the array allThreads ...
        this.allChatsArr.push(this.allChats[j]) // ...then push alle j data to the empty array allThreadsArr; data is send to child component
      }
      console.log('Contents of allChatsArr:', this.allChatsArr);
    }
    window.document.getElementById('chat')!.classList.remove('d-n');
    window.document.getElementById('imprint')!.classList.add('d-n');
    window.document.getElementById('channel')!.classList.add('d-n');
    window.document.getElementById('threads')!.classList.add('d-n');
    this.changeBGGray();
  }


  changeBGWhite() {
    this.content.nativeElement.style.background = '#FAFAFA'
  }


  changeBGGray() {
    this.content.nativeElement.style.background = '#EEEEEE'
  }


  async openDialogUserInfo() {
    const user = await this.fireauth.currentUser;
    if (!user?.isAnonymous) { //only open dialog if user is registered
      const dialogRef = this.dialog.open(DialogUserInfoComponent);
    }
  }


  signOut() {
    this.auth.signOut();
  }

}

function getDocs(subColRef: (val: any) => void) {
  throw new Error('Function not implemented.');
}
function switchMap(arg0: (channels: { channelId: any; }) => any): import("rxjs").OperatorFunction<{ channelId: string; }[], unknown> {
  throw new Error('Function not implemented.');
}

function tap(arg0: (roles: any) => void): import("rxjs").OperatorFunction<unknown, unknown> {
  throw new Error('Function not implemented.');
}

function combineLatest(arg0: any) {
  throw new Error('Function not implemented.');
}

