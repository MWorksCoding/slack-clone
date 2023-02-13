import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-varify-email',
  templateUrl: './varify-email.component.html',
  styleUrls: ['./varify-email.component.scss']
})
export class VarifyEmailComponent {

  verifiedEmail: string = '';

  constructor(private auth: AuthService) {
    this.verifiedEmail = this.auth.currentEmail;
  }


  resendVerificationEmail() {
    this.auth.resendVerificationMail()
  }
}

