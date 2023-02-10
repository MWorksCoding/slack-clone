import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../shared/auth.service';
import { Channel } from 'src/models/channel.class';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent {

  constructor(public dialog: MatDialog, private auth: AuthService, private firestore: AngularFirestore,) { // Zugriff auf Firestore, Abonnieren in dieser Komponente
  }

  channels = [];
  channelId = '';
  channel: Channel = new Channel();

  ngOnInit(): void {
    this.loadChannel();
  }

  loadChannel() {  
    this.firestore
      .collection('channels')
      .doc(this.channelId)
      .valueChanges()
      .subscribe((channel: any) => {
        this.channel = new Channel(channel);
      })
  }

}
