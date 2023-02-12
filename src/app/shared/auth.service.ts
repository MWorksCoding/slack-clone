import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogResetPasswordInfoComponent } from '../dialog-reset-password-info/dialog-reset-password-info.component';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;
  authState: any;
  currentUser: any;
  currentEmail: any;


  constructor(private fireauth: AngularFireAuth, private router: Router, public dialog: MatDialog) { }


  signIn(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password)
      .then(res => {
        localStorage.setItem('user', JSON.stringify(res.user));
        this.checkEmailVerified(res);
      }, err => {
        this.openErrorDialog(err);
        this.router.navigate(['/signin']);
      });
  }


  checkEmailVerified(res: any) {
    if (res.user?.emailVerified == true) {
      this.router.navigate(['/mainpage']);
    } else {
      this.router.navigate(['/varify-email']);
    }
  }


  signInWithGoogle() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider)
      .then(res => {
        this.router.navigate(['/mainpage']);
        localStorage.setItem('user', JSON.stringify(res.user));
      }, err => {
        this.openErrorDialog(err);
      })
  }


  signInAsGuest() {
    this.fireauth.signInAnonymously()
      .then(res => {
        this.router.navigate(['/mainpage']);
        localStorage.setItem('user', JSON.stringify(res.user));
      }, err => {
        this.openErrorDialog(err);
      })
  }


  async signUp(email: string, password: string) {
    this.fireauth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        localStorage.setItem('user', JSON.stringify(res.user));
        this.currentEmail = email;
        this.router.navigate(['/signin']);
        this.sendEmailForVarification(res.user);
      }, err => {
        this.openErrorDialog(err);
        this.router.navigate(['/signup']);
      })
  }


  sendEmailForVarification(user: any) {
    user.sendEmailVerification()
      .then((res: any) => {
        this.router.navigate(['/varify-email']);
      }, (err: any) => {
        this.openErrorDialog(err);
      });
  }


  resendVerificationMail() {
    return this.fireauth.currentUser
      .then((u: any) => {
        u.sendEmailVerification()
        alert('success');
      }, err => {
        this.openErrorDialog(err);
      });
  }


  signOut() {
    this.fireauth.signOut()
      .then(() => {
        localStorage.removeItem('user');
        this.router.navigate(['/signin']);
      }, err => {
        this.openErrorDialog(err);
      })
  }


  forgotPassword(email: string) {
    this.fireauth.sendPasswordResetEmail(email)
      .then(() => {
        this.dialog.open(DialogResetPasswordInfoComponent);
      }, err => {
        this.openErrorDialog(err);
      })
  }


  openErrorDialog(err: { message: string; code: string; }) {
    this.dialog.open(DialogErrorComponent,
      {
        data:
        {
          message: err.message,
          code: err.code
        }
      });
  }

}
