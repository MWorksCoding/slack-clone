import { Component, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../shared/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Output } from '@angular/core';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss']
})
export class ThreadsComponent {
  componentData: any;
  allThreads: any[] = [];
  allThreadsArr: any[] = [];

  constructor(public dialog: MatDialog, private auth: AuthService, private firestore: AngularFirestore, private route: ActivatedRoute) { // Zugriff auf Firestore, Abonnieren in dieser Komponente
  }

  @Input() inputFromParentThreadArray: {
    channelName: string;
    description: string;
    userMessage: string;
    userMessageDate: string;
    userMessageTime: string;
    userName: string;
    channelId: string;
  }[] = [];

  @Output() postChannelNameEvent = new EventEmitter<string>();

  ngOnInit(): void {
    console.log('inputFromParentThreadArray:', this.inputFromParentThreadArray)
    let modifiedInputFromParentThreadArray = this.inputFromParentThreadArray.map(thread => {
      return {
        channelName: thread.channelName,
        description: thread.description,
        userMessage: thread.userMessage,
        userMessageDate: thread.userMessageDate,
        userMessageTime: thread.userMessageTime,
        userName: thread.userName,
        channelId: thread.channelId
      };
    });
    console.log('modifiedInputFromParentChatArray:', modifiedInputFromParentThreadArray);
  }

  openPost(thread: any) {
    this.postChannelNameEvent.emit(thread.channelName);
  }
}
