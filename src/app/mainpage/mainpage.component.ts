import { Component, ElementRef, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent {


  constructor(public dialog: MatDialog, public auth: AuthService, private firestore: AngularFirestore, private route: ActivatedRoute,
    private fireauth: AngularFireAuth) { // Zugriff auf Firestore, Abonnieren in dieser Komponente
  }


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

  async ngOnInit(): Promise<void> {
    await this.loadChannels();
    await this.loadUsers();
    await this.loadThreads();
    this.openThreads();
    await this.auth.showActualUser();
    this.route.params.subscribe((params) => {
      console.log(params);
    });
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
        console.log('Mainpage: Channel ID is:', channelId);
        this.channels = channelId;
      });
    ;
  }

  allThreads: any[] = [];
  allThreadsArr: any[] = [];
  threadId = '';

  loadThreads() {
    this.firestore
      .collection('channels')
      .valueChanges({ idField: 'channelId' })
      .subscribe((channelId: any) => {
        this.channels = channelId;

        for (let i = 0; i < this.channels.length; i++) {
          this.allChatChannel = this.channels[i];
          this.firestore
            .collection('channels')
            .doc(this.channelId)
            .collection('threads')
            .get()
            .subscribe((querySnapshot) => {
              console.log('Query Snapshot is:', querySnapshot)
              querySnapshot.forEach((doc) => {
                console.log('Angular University', doc.data());
              });
            });
        }


        // .collection('channels')
        // .doc('<id>')
        // .collection('threads')
        // .doc('672IvdSL3ClRekuivi9S')
        // .get()
        // .subscribe((doc) => {
        //   if (doc.exists) {
        //     console.log(doc.get('username'));
        //   }
        // });

        // .collection('channels')
        // .doc(this.allChatChannel)
        // .collection('threads')
        // .valueChanges({ idField: 'threadId' })
        // .subscribe(val => console.log('threads are:', val));


        // .subscribe((thread: any)) => {
        // this.allThreads.push(thread);
        // this.allThreadsArr.push(this.allThreads[i]);
        // this.forChildUserName.push
      });

    // this.firestore
    //   .collection("channels")
    //   .doc(this.channelId)
    //   .collection("threads")
    //   .valueChanges()
    //   .subscribe(val => console.log('Angular University', val));
  }

  loadUsers() {
    this.loading = true;
    this.firestore
      .collection('users')
      .valueChanges({ idField: 'userId' })
      .subscribe((chatId: any) => {
        console.log('User ID is:', chatId);
        this.users = chatId;
      });
  }

  openImprint() {  // Route einbauen°!°
    // this.content.nativeElement.innerHTML = 'Impressum'

    window.document.getElementById('imprint')!.classList.remove('d-n');
    window.document.getElementById('threads')!.classList.add('d-n');
    window.document.getElementById('channel')!.classList.add('d-n');
    window.document.getElementById('chat')!.classList.add('d-n');
    this.changeBGWhite();
  }


  openThreads() {
    window.document.getElementById('threads')!.classList.remove('d-n');
    window.document.getElementById('imprint')!.classList.add('d-n');
    window.document.getElementById('channel')!.classList.add('d-n');
    window.document.getElementById('chat')!.classList.add('d-n');
    this.changeBGWhite();
  }


  openChannel(i: any) {
    console.log('String to child-component:', i['channelName'])
    this.forChildChannelName = i['channelName'];
    this.forChildChannelDescription = i['description'];
    window.document.getElementById('channel')!.classList.remove('d-n');
    window.document.getElementById('imprint')!.classList.add('d-n');
    window.document.getElementById('threads')!.classList.add('d-n');
    window.document.getElementById('chat')!.classList.add('d-n');
    this.changeBGWhite();
  }


  openChat(i: any) {
    console.log('User to child-component:', i['userName'])
    this.forChildUserName = i['userName'];
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