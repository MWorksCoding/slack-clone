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

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent {
  constructor(public dialog: MatDialog, public auth: AuthService, private firestore: AngularFirestore, private route: ActivatedRoute) { // Zugriff auf Firestore, Abonnieren in dieser Komponente
  }

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger | undefined;
  @ViewChild('content') content!: ElementRef;


  forChildChannelName: string = '';
  forChildDescription: string = '';

  channelId = '';
  channels = [];
  allChatChannel = '';
  ChannelMenuIsOpen = true;
  DirectMessagesMenuIsOpen = true;


  async ngOnInit(): Promise<void> {
    await this.loadChannels();
    this.openThreads();
    this.auth.showActualUser();
    this.route.params.subscribe((params) => {
      console.log(params);
    });
  }


  signOut() {
    this.auth.signOut();
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
    // this.route.params.subscribe((params) => {
    //   console.log(params);
    // });
    this.firestore
      .collection('channels')
      .valueChanges({ idField: 'channelId' })
      // .subscribe((changes: any) => {
      //   this.channels = changes;
      // })
      .subscribe((channelId: any) => {
        console.log('Mainpage: Channel ID is:', channelId);
        this.channels = channelId;
      });
    ;
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
    // this.route.navigate(['/channel'], {state: {data: {...this.channels}}});
    console.log('String to child-component:', i['channelName'])

    this.forChildChannelName = i['channelName'];
    this.forChildDescription = i['description'];

    // DIREKT UMWANDELN ZUM STRING ZUR WEITERGABE AN DAS CHILD-COMPONENT 'CHANNEL'

    // this.activeChannel.push(i);
    // this.activeChannel.push(test1)
    // JSON.stringify(this.activeChannel);
    // console.log('Active Channel is:', this.activeChannel);


    window.document.getElementById('channel')!.classList.remove('d-n');
    window.document.getElementById('imprint')!.classList.add('d-n');
    window.document.getElementById('threads')!.classList.add('d-n');
    window.document.getElementById('chat')!.classList.add('d-n');
    this.changeBGWhite();
  }

  openChat() {
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


  openDialog() {
    const dialogRef = this.dialog.open(DialogUserInfoComponent, { restoreFocus: false });

    // Manually restore focus to the menu trigger since the element that
    // opens the dialog won't be in the DOM any more when the dialog closes.
    dialogRef.afterClosed().subscribe(() => this.menuTrigger?.focus());
  }


  logout() {
    this.auth.signOut();
  }

}
