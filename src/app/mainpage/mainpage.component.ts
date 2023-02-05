import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent {
  constructor(private auth: AuthService) { // Zugriff auf Firestore, Abonnieren in dieser Komponente

  }

  signOut() {
    this.auth.signOut();
  }

}
