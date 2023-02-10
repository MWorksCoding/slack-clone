import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateChannelComponent } from '../dialog-create-channel/dialog-create-channel.component';
import { DialogCreateChatComponent } from '../dialog-create-chat/dialog-create-chat.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ImprintComponent } from '../imprint/imprint.component';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent {
  constructor(public dialog: MatDialog, private auth: AuthService, private firestore: AngularFirestore,) { // Zugriff auf Firestore, Abonnieren in dieser Komponente
  }

  @ViewChild('content') content!: ElementRef;

  channels = [];
  allChatChannel = '';
  imprint = false;

  ngOnInit(): void {
    this.loadChannels();
  }


  signOut() {
    this.auth.signOut();
  }

  ChannelMenuIsOpen = true;
  DirectMessagesMenuIsOpen = true;

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
    this.firestore
      .collection('channels')
      .valueChanges({ idField: 'channelId' })
      .subscribe((changes: any) => {
        this.channels = changes;
      })
  }

  openImprint() {  // Route einbauen°!°
    // this.content.nativeElement.innerHTML = 'Impressum'
    // window.document.getElementById('imprint')!.classList.remove('d-n');
    this.imprint = !this.imprint;
  }
}
