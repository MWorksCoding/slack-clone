import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from "firebase/compat/app";
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-sign-in-overview',
  templateUrl: './sign-in-overview.component.html',
  styleUrls: ['./sign-in-overview.component.scss']
})
export class SignInOverviewComponent {


  constructor(private router: Router, private auth: AuthService) { }

  email: string = '';
  password: string = '';
  emailForm = new FormControl('', [Validators.required, Validators.email]);
  passwordForm = new FormControl('', [Validators.required, Validators.minLength(8)]);
  hide = true;


  signIn() {
    if (this.emailForm.hasError('required') || this.emailForm.hasError('email')) {
      alert('Please enter email');
      return;
    }

    if (this.passwordForm.hasError('required') || this.passwordForm.hasError('minlength')) {
      alert('Please enter password');
      return;
    }

    this.auth.signIn(this.email, this.password);
    this.email = '';
    this.password = '';
  }


  // signInGoogle() {
  //   const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
  //   this.afAuth.signInWithPopup(googleAuthProvider)
  //     .then(res => {
  //       this.router.navigate(['/mainpage']);
  //     }, err => {
  //       alert(err.message);
  //     })
  // }



  getErrorMessageEmail() {
    if (this.emailForm.hasError('required')) {
      return 'You must enter your Email';
    }

    return this.emailForm.hasError('email') ? 'Not a valid email' : '';
  }


  getErrorMessagePassword() {
    if (this.passwordForm.hasError('required')) {
      return 'You must enter your Password';
    }
    return this.passwordForm.hasError('minlength') ? 'Not a valid password' : '';
  }
}


