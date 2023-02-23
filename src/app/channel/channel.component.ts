import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../shared/auth.service';
import { Channel } from 'src/models/channel.class';
import { ActivatedRoute } from '@angular/router';
import { Input } from '@angular/core';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent {

  constructor(public dialog: MatDialog, private auth: AuthService, private firestore: AngularFirestore, private route: ActivatedRoute) { // Zugriff auf Firestore, Abonnieren in dieser Komponente
  }

  @Input() inputFromParent: string = "";
  @Input() inputFromParentDescriptiont: string = "";

  allChatChannel = '';
  channels = [];
  channelId: string = '';
  channel: Channel = new Channel();

  ngOnInit(): void {
    // this.channels = window.history.state.data;
    this.loadChannel();
  }

  loadChannel() {
    // this.route.params.subscribe((params => {
    //   this.channelId = params['get']('id');
       this.route.params.subscribe((params) => {
         console.log('Channel JSON is:', params);
       });
    // }))
    this.firestore
      .collection('channels')
      // .doc(this.channelId)
      .valueChanges()
      .subscribe((channelId: any) => {
        // this.channel = new Channel(channel);
        console.log('Channel-Component: Channel ID is:', channelId);
        this.channels = channelId;
      })
  }

}