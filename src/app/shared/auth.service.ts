import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogResetPasswordInfoComponent } from '../dialog-reset-password-info/dialog-reset-password-info.component';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';
import { SpinnerService } from './spinner.service';
import { Observable, of, Subscription, switchMap } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UploadServiceService } from './upload-service.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {


  actualUser$: Observable<any> | undefined;
  user: any;
  userSubscription: Subscription | undefined;
  currentUserSubscription: Subscription | undefined;
  profilePictureSubscription: Subscription | undefined;
  currentUserId: string = '';
  currentUserName: any;
  currentEmail: any;
  photoURL: any;
  emailUpdated = new EventEmitter<string>();

  profilPicture: any;
  imageUrl: any;


  constructor(private fireauth: AngularFireAuth, private firestore: AngularFirestore, private router: Router,
    public dialog: MatDialog, private spinnerService: SpinnerService, private storage: AngularFireStorage, public uploadService: UploadServiceService) {



  }


  //creates an observable that emits the current users user name
  showActualUser() {
    this.actualUser$ = this.fireauth.authState.pipe(
      switchMap(actualUser => {
        if (actualUser && !actualUser?.isAnonymous) { //will only carried out if actualUser is registered
          //and not logged in as Guest
          this.currentUserId = actualUser.uid;
          const imagePath = this.storage.ref(`users/${this.currentUserId}/profile-picture`);
          this.profilPicture = imagePath.getDownloadURL();
          this.profilePictureSubscription = this.profilPicture.subscribe((url: any) => {
            this.imageUrl = url;
            console.log('Guest img', this.imageUrl);
          })



          this.currentUserSubscription = this.firestore.doc(`users/${actualUser.uid}`).valueChanges()
            .subscribe((data: any) => {
              this.currentUserName = data['userName'];
            });
          return this.firestore.doc(`users/${actualUser.uid}`).valueChanges();
        } else
          return of(null);
      })
    );
  }


  async updateEmailAndName(newEmail: string, newUserName: string) {
    this.spinnerService.settProgressingStatus(true);
    this.fireauth.currentUser
      .then(async user => {
        if (user) {
          await this.updateEmail(user, newEmail, newUserName);
          this.spinnerService.settProgressingStatus(false);
          this.dialog.closeAll();
        }
      }, err => {
        this.spinnerService.settProgressingStatus(false);
        this.openErrorDialog(err);
      });
  }


  async updateEmail(user: any, newEmail: string, newUserName: string) {
    user.updateEmail(newEmail)
      .then(() => {
        this.currentEmail = newEmail;
        this.emailUpdated.emit(newEmail);
        this.updateUsername(user, newUserName);
      }, (err: { message: string; code: string; }) => {
        this.openErrorDialog(err);
      });
  }


  async updateUsername(user: any, newUserName: string) {
    const userRef = this.firestore.collection('users')
      .doc(user.uid);
    userRef.update({ userName: newUserName })
      .then(() => {
      }, (err: { message: string; code: string; }) => {
        this.openErrorDialog(err);
      });
  }


  signIn(email: string, password: string) {
    this.spinnerService.settLoadingStatus(true);
    this.fireauth.signInWithEmailAndPassword(email, password)
      .then(res => {
        localStorage.setItem('user', JSON.stringify(res.user));
        this.checkEmailVerified(res);
        //subscribes to the user observable and sets variable currentEmail to the user email if logged in
        this.userSubscription = this.fireauth.user.subscribe((user) => {
          if (user)
            this.currentEmail = user.email;
        });
        this.spinnerService.settLoadingStatus(false);
      }, err => {
        this.spinnerService.settLoadingStatus(false);
        this.openErrorDialog(err);
        this.router.navigate(['/signin']);
      });
  }


  checkEmailVerified(res: any) {
    this.spinnerService.settLoadingStatus(true);
    if (res.user?.emailVerified == true)
      this.router.navigate(['/mainpage']);
    else
      this.router.navigate(['/varify-email']);
    this.spinnerService.settLoadingStatus(false);
  }


  signInWithGoogle() {
    this.spinnerService.settLoadingStatus(true);
    return this.fireauth.signInWithPopup(new GoogleAuthProvider)
      .then(res => {
        this.router.navigate(['/mainpage']);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.spinnerService.settLoadingStatus(false);
      }, err => {
        this.spinnerService.settLoadingStatus(false);
        this.openErrorDialog(err);
      })
  }


  signInAsGuest() {
    this.spinnerService.settLoadingStatus(true);
    this.fireauth.signInAnonymously()
      .then(res => {
        this.router.navigate(['/mainpage']);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.spinnerService.settLoadingStatus(false);
      }, err => {
        this.spinnerService.settLoadingStatus(false);
        this.openErrorDialog(err);
      })
  }


  async signUp(userName: string, email: string, password: string) {
    const data = { userName };
    this.spinnerService.settLoadingStatus(true);
    this.fireauth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        this.successfulSignUp(data, res, email);
        this.uploadService.uploadImage(res.user?.uid);
      }, err => {
        this.spinnerService.settLoadingStatus(false);
        this.openErrorDialog(err);
        this.router.navigate(['/signup']);
      })
  }


  successfulSignUp(data: any, res: any, email: string) {
    this.firestore.collection('users')
      .doc(res.user?.uid).set(data);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.currentEmail = email;
    this.router.navigate(['/signin']);
    this.sendEmailForVarification(res.user);
    this.spinnerService.settLoadingStatus(false);
  }


  sendEmailForVarification(user: any) {
    this.spinnerService.settLoadingStatus(true);
    user.sendEmailVerification()
      .then((res: any) => {
        this.router.navigate(['/varify-email']);
        this.spinnerService.settLoadingStatus(false);
      }, (err: any) => {
        this.spinnerService.settLoadingStatus(false);
        this.openErrorDialog(err);
      });
  }


  resendVerificationMail() {
    this.spinnerService.settLoadingStatus(true);
    return this.fireauth.currentUser
      .then((u: any) => {
        u.sendEmailVerification();
        this.spinnerService.settLoadingStatus(false);
      }, err => {
        this.spinnerService.settLoadingStatus(false);
        this.openErrorDialog(err);
      });
  }



  signOut() {
    this.spinnerService.settLoadingStatus(true);
    this.fireauth.signOut()
      .then(() => {
        localStorage.removeItem('user');
        this.router.navigate(['/signin']);
        this.spinnerService.settLoadingStatus(false);
      }, err => {
        this.spinnerService.settLoadingStatus(false);
        this.openErrorDialog(err);
      })
  }


  forgotPassword(email: string) {
    this.spinnerService.settLoadingStatus(true);
    this.fireauth.sendPasswordResetEmail(email)
      .then(() => {
        this.dialog.open(DialogResetPasswordInfoComponent);
        this.spinnerService.settLoadingStatus(false);
      }, err => {
        this.spinnerService.settLoadingStatus(false);
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


  unsubscribe() {
    if (this.userSubscription) {
      this.userSubscription?.unsubscribe();
    }
    if (this.profilePictureSubscription) {
      this.profilePictureSubscription?.unsubscribe();
    }
    if (this.currentUserSubscription)
      this.currentUserSubscription.unsubscribe();
  }


  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription?.unsubscribe();
    }
    if (this.profilePictureSubscription) {
      this.profilePictureSubscription.unsubscribe();
      console.log('unsubscribed');
    }
  }
}

