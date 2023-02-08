import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-varify-email',
  templateUrl: './varify-email.component.html',
  styleUrls: ['./varify-email.component.scss']
})
export class VarifyEmailComponent {

  user = this.afAuth.user;

  constructor(private auth: AuthService, public afAuth: AngularFireAuth) {

  }


  resendVerificationEmail() {
    this.auth.resendVerificationMail()
  }


  // sendVerificationEmail() {
  //   console.log(this.auth.currentUser);
  //   return this.auth.currentUser
  //     .then((user: any) => {
  //       return user.sendEmailVerification();
  //     });
  // }
}

