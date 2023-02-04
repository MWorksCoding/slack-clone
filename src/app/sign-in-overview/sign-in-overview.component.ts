import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from "firebase/compat/app";

@Component({
  selector: 'app-sign-in-overview',
  templateUrl: './sign-in-overview.component.html',
  styleUrls: ['./sign-in-overview.component.scss']
})
export class SignInOverviewComponent {
  constructor(private router: Router, public afAuth: AngularFireAuth) { }
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  hide = true;

  signIn() {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.signInWithPopup(googleAuthProvider)
      .then(res => {
        this.router.navigate(['/mainpage']);
      }, err => {
        alert(err.message);
      })
  }

  signOut() {
    this.afAuth.signOut();
  }

  getErrorMessageEmail() {
    if (this.email.hasError('required')) {
      return 'You must enter your Email';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getErrorMessagePassword() {
    if (this.password.hasError('required')) {
      return 'You must enter your Password';
    }
    return this.password.hasError('minlength') ? 'Not a valid password' : '';
  }



}


