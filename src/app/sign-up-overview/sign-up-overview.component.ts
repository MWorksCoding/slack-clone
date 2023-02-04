import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import firebase from "firebase/compat/app";

@Component({
  selector: 'app-sign-up-overview',
  templateUrl: './sign-up-overview.component.html',
  styleUrls: ['./sign-up-overview.component.scss']
})
export class SignUpOverviewComponent {
  constructor(private router: Router, public afAuth: AngularFireAuth) { }
  username = new FormControl('', [Validators.required, Validators.minLength(1)]);
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

  getErrorMessageUsername() {
    if (this.username.hasError('required')) {
      return 'You must enter a Username'
    }

    return this.username.hasError('minlength') ? 'Not a valid username' : '';
  }

  getErrorMessageEmail() {
    if (this.email.hasError('required')) {
      return 'You must enter a Email';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getErrorMessagePassword() {
    if (this.password.hasError('required')) {
      return 'You must enter a Password';
    }
    return this.password.hasError('minlength') ? 'Not a valid password' : '';
  }
}
