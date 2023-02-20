import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateChannelComponent } from '../dialog-create-channel/dialog-create-channel.component';
import { DialogCreateChatComponent } from '../dialog-create-chat/dialog-create-chat.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatMenuModule } from '@angular/material/menu';
import { DialogUserInfoComponent } from '../dialog-user-info/dialog-user-info.component';
import { Channel } from 'src/models/channel.class';
import { ChannelComponent } from '../channel/channel.component';
import { ActivatedRoute } from '@angular/router';
import { user } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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
