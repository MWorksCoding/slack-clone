import { EventEmitter, Injectable } from '@angular/core';
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
import { FormControl } from '@angular/forms';
import { doc, DocumentSnapshot, getDoc } from "firebase/firestore";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  actualUser$: Observable<any> | undefined;
  profilPicture: Observable<any> | undefined;

  currentUserId: string = '';
  currentUserName: FormControl<any> | undefined;
  currentEmail: any;
  emailUpdated = new EventEmitter<string>();

  userSubscription: Subscription | undefined; //Subscription for current user email
  currentUserSubscription: Subscription | undefined; //Subscription for current user name
  profilePictureSubscription: Subscription | undefined; //Subscription for profile picture

  constructor(
    private fireauth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private storage: AngularFireStorage,
    public uploadService: UploadServiceService
  ) {}

  /**
   * creates an observable that emits the current users data if user is authenticated, else null
   */
  showActualUser() {
    this.actualUser$ = this.fireauth.authState.pipe(
      //returns observable that emits the currently
      //authenticated user
      switchMap((actualUser) => {
        //transform one observable into another
        //takes currently authenticated user as argument and returns new observable
        if (actualUser && !actualUser?.isAnonymous) {
          //will only carried out if actualUser is registered
          //and not logged in as Guest
          this.loadAndSubscribeCurrentProfilPicture(actualUser);
          this.subscribeToEmailAndUsername(actualUser);
          return this.firestore.doc(`users/${actualUser.uid}`).valueChanges();
        } else return of(null); // returns observable of null
      })
    );
  }

  /**
   * subscribes to profil picture and updates it when a new one gets uploaded
   * @param actualUser {object} represents the currently authenticated user
   */
  loadAndSubscribeCurrentProfilPicture(actualUser: firebase.default.User) {
    this.currentUserId = actualUser.uid;
    const imagePath = this.storage.ref(
      `users/${this.currentUserId}/profile-picture`
    );
    this.profilPicture = imagePath.getDownloadURL(); //returns Promise
    this.profilePictureSubscription = this.profilPicture.subscribe(
      (url: string) => {
        //emits download URL of the file
        this.uploadService.url$.next(url);
      }
    );
  }

  /**
   * subscribes to two observables, sets variable currentEmail to the user email if logged in
   * subscribes to changes in firestore database collection and updates user name
   * @param actualUser {object} represents the currently authenticated user
   */
  subscribeToEmailAndUsername(actualUser: firebase.default.User) {
    this.userSubscription = this.fireauth.user.subscribe((user) => {
      if (user) this.currentEmail = user.email;
    });
    this.currentUserSubscription = this.firestore
      .doc(`users/${actualUser.uid}`)
      .valueChanges()
      .subscribe((data: any) => {
        this.currentUserName = data['userName'];
      });
  }

  /**
   *calls update email function and closes dialog field
   * @param newEmail
   * @param newUserName
   */
  async updateEmailAndName(newEmail: string, newUserName: string) {
    this.spinnerService.settProgressingStatus(true);
    this.fireauth.currentUser.then(
      async (user) => {
        if (user) {
          await this.updateEmail(user, newEmail, newUserName);
          this.spinnerService.settProgressingStatus(false);
          this.dialog.closeAll();
        }
      },
      (err) => {
        this.spinnerService.settProgressingStatus(false);
        this.openErrorDialog(err);
      }
    );
  }

  /**
   * updates the email
   * @param user {object} represents the currently authenticated user
   */
  async updateEmail(
    user: firebase.default.User,
    newEmail: string,
    newUserName: string
  ) {
    user.updateEmail(newEmail).then(
      () => {
        this.currentEmail = newEmail;
        this.emailUpdated.emit(newEmail); //notify all subscribers of new email value
        this.updateUsername(user, newUserName);
      },
      (err: { message: string; code: string }) => {
        this.openErrorDialog(err);
      }
    );
  }

  /**
   * updates the user name in the collection
   * @param user {object} represents the currently authenticated user
   * @param newUserName {string}
   */
  async updateUsername(user: firebase.default.User, newUserName: string) {
    const userRef = this.firestore.collection('users').doc(user.uid);
    userRef.update({ userName: newUserName }).then(
      () => {},
      (err: { message: string; code: string }) => {
        this.openErrorDialog(err);
      }
    );
  }

  /**
   * checks sign in
   */
  signIn(email: string, password: string) {
    this.spinnerService.settLoadingStatus(true);
    this.fireauth.signInWithEmailAndPassword(email, password).then(
      (res) => {
        localStorage.setItem('user', JSON.stringify(res.user));
        this.checkEmailVerified(res);
        this.spinnerService.settLoadingStatus(false);
      },
      (err) => {
        this.loadingStatusFalseErrorDialog(err);
        this.router.navigate(['/signin']);
      }
    );
  }

  /**
   * checks if email is verfified
   * @param res {object}, with user credetial
   */
  checkEmailVerified(res: firebase.default.auth.UserCredential) {
    this.spinnerService.settLoadingStatus(true);
    if (res.user?.emailVerified == true) this.router.navigate(['/mainpage']);
    else this.router.navigate(['/varify-email']);
    this.spinnerService.settLoadingStatus(false);
  }

  /**
   * sign in with Google
   */
  signInWithGoogle() {
    let userName = 'Guest';
    this.spinnerService.settLoadingStatus(true);
    this.fireauth.signInWithPopup(new GoogleAuthProvider()).then(
      async (res) => {
        const firestore = this.firestore.firestore;
        let docRef = firestore.collection('users').doc(res.user?.uid);
        //  this.firestore.collection('users').doc(res.user?.uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
          console.log('Exists', docSnap.data())
        }
        else {
          console.log('not exists');
          const data = { userName };
          this.firestore.collection('users').doc(res.user?.uid).set(data);
        }
        this.firestore.collection('users').doc(res.user?.uid).valueChanges()
        .subscribe((value: any) => {
          userName = value;
          console.log('userName', userName);
        })
        this.uploadService.uploadNewImage(res.user?.uid);
        this.router.navigate(['/mainpage']);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.spinnerService.settLoadingStatus(false);
      },
      (err) => {
        this.loadingStatusFalseErrorDialog(err);
      }
    );
  }


  /**
   * sign in as Guest/Anonymously
   */
  signInAsGuest() {
    this.spinnerService.settLoadingStatus(true);
    this.fireauth.signInAnonymously().then(
      (res) => {
        this.router.navigate(['/mainpage']);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.uploadService.url$.next('assets/img/name-icon.png');
        this.spinnerService.settLoadingStatus(false);
      },
      (err) => {
        this.loadingStatusFalseErrorDialog(err);
      }
    );
  }

  /**
   * creates User with Email and Password, uploads default profil picture
   */
  async signUp(userName: string, email: string, password: string) {
    const data = { userName };
    this.spinnerService.settLoadingStatus(true);
    this.fireauth.createUserWithEmailAndPassword(email, password).then(
      (res) => {
        this.successfulSignUp(data, res, email);
        this.uploadService.uploadNewImage(res.user?.uid);
      },
      (err) => {
        this.loadingStatusFalseErrorDialog(err);
        this.router.navigate(['/signup']);
      }
    );
  }

  /**
   * stores data in firebase collection, sets current Email and send email for verification
   * @param data {object}, which includes userName
   * @param res {object}, with user credetial
   * @param email {string} email address
   */
  successfulSignUp(
    data: Object,
    res: firebase.default.auth.UserCredential,
    email: string
  ) {
    this.firestore.collection('users').doc(res.user?.uid).set(data);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.currentEmail = email;
    this.router.navigate(['/signin']);
    this.sendEmailForVarification(res.user);
    this.spinnerService.settLoadingStatus(false);
  }

  /**
   * email for verification will be send to the user
   * @param user instance of the user class, which is part of Firebase Authentication
   * represent a user account
   */
  sendEmailForVarification(user: any) {
    this.spinnerService.settLoadingStatus(true);
    user.sendEmailVerification().then(
      () => {
        this.router.navigate(['/varify-email']);
        this.spinnerService.settLoadingStatus(false);
      },
      (err: any) => {
        this.loadingStatusFalseErrorDialog(err);
      }
    );
  }

  /**
   * resends Email to verify your email
   */
  resendVerificationMail() {
    this.spinnerService.settLoadingStatus(true);
    this.fireauth.currentUser.then(
      (user: any) => {
        user.sendEmailVerification();
        this.spinnerService.settLoadingStatus(false);
      },
      (err) => {
        this.loadingStatusFalseErrorDialog(err);
      }
    );
  }

  /**
   * user will be logged out
   */
  signOut() {
    this.spinnerService.settLoadingStatus(true);
    this.fireauth.signOut().then(
      () => {
        localStorage.removeItem('user');
        this.router.navigate(['/signin']);
        this.spinnerService.settLoadingStatus(false);
      },
      (err) => {
        this.loadingStatusFalseErrorDialog(err);
      }
    );
  }

  /**
   * send email to reset your password and opens Dialogfield for info that email was send
   * @param email {string}, to this email the link will be send to reset your password
   */
  forgotPassword(email: string) {
    this.spinnerService.settLoadingStatus(true);
    this.fireauth.sendPasswordResetEmail(email).then(
      () => {
        this.dialog.open(DialogResetPasswordInfoComponent);
        this.spinnerService.settLoadingStatus(false);
      },
      (err) => {
        this.loadingStatusFalseErrorDialog(err);
      }
    );
  }

  /**
   * sets loading status of spinner false and opens an error dialog
   * @param err {message: string, code: string}
   */
  loadingStatusFalseErrorDialog(err: { message: string; code: string }) {
    this.spinnerService.settLoadingStatus(false);
    this.openErrorDialog(err);
  }

  /**
   * when an error occurs this function will be called and opens a dialogfield with the
   * error message and code
   * @param err {message: string, code: string}
   */
  openErrorDialog(err: { message: string; code: string }) {
    this.dialog.open(DialogErrorComponent, {
      data: {
        message: err.message,
        code: err.code,
      },
    });
  }

  /**
   * unsubscribe from Subscriptions
   */
  unsubscribe() {
    if (this.userSubscription) this.userSubscription?.unsubscribe();
    if (this.profilePictureSubscription)
      this.profilePictureSubscription?.unsubscribe();
    if (this.currentUserSubscription)
      this.currentUserSubscription.unsubscribe();
  }
}
