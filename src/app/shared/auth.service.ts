import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private fireauth: AngularFireAuth, private router: Router) { }


  signIn(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password)
      .then(res => {
        localStorage.setItem('token', 'true');


        if (res.user?.emailVerified == true) {
          this.router.navigate(['/mainpage']);
        } else {
          this.router.navigate(['/varify-email']);
        }

      }, err => {
        alert(err.message);
        this.router.navigate(['/signin']);
      });
  }


  signUp(email: string, password: string) {
    this.fireauth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        alert('registration successful');
        this.router.navigate(['/signin']);
        this.sendEmailForVarification(res.user);
      }, err => {
        alert(err.message);
        this.router.navigate(['/signup']);
      })
  }


  sendEmailForVarification(user: any) {
    user.sendEmailVerification()
      .then((res: any) => {
        this.router.navigate(['/varify-email']);
      }, (err: any) => {
        alert('Something went wrong. Not able to send mail to your email');
      });
  }


  signOut() {
    this.fireauth.signOut()
      .then(() => {
        localStorage.removeItem('token');
        this.router.navigate(['/signin']);
      }, err => {
        alert(err.message);
      })
  }


  forgotPassword(email: string) {
    this.fireauth.sendPasswordResetEmail(email)
      .then(() => {
        this.router.navigate(['/varify-email']);
      }, err => {
        alert('Something went wrong');
      })
  }


}
