import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import firebase from "firebase/compat/app";
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-sign-up-overview',
  templateUrl: './sign-up-overview.component.html',
  styleUrls: ['./sign-up-overview.component.scss']
})
export class SignUpOverviewComponent {


  constructor(private router: Router, private auth: AuthService) { }


  email: string = '';
  password: string = '';
  usernameForm = new FormControl('', [Validators.required, Validators.minLength(1)]);
  emailForm = new FormControl('', [Validators.required, Validators.email]);
  passwordForm = new FormControl('', [Validators.required, Validators.minLength(8)]);
  hide = true;

  signInWithGoogle() {
    this.auth.signInWithGoogle();
  }

  signUp() {
    if (this.usernameForm.hasError('required') || this.usernameForm.hasError('minglength')) {
      alert('Please enter username');
      return;
    }

    if (this.emailForm.hasError('required') || this.emailForm.hasError('email')) {
      alert('Please enter email');
      return;
    }

    if (this.passwordForm.hasError('required') || this.passwordForm.hasError('minlength')) {
      alert('Please enter password');
      return;
    }

    this.auth.signUp(this.email, this.password);
    this.email = '';
    this.password = '';
  }


  getErrorMessageUsername() {
    if (this.usernameForm.hasError('required')) {
      return 'You must enter a Username'
    }

    return this.usernameForm.hasError('minlength') ? 'Not a valid username' : '';
  }


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
