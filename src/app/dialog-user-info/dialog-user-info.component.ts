import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, GetDownloadURLPipe } from '@angular/fire/compat/storage';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { finalize, from, map, Observable, switchMap } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { SpinnerService } from '../shared/spinner.service';


@Component({
  selector: 'app-dialog-user-info',
  templateUrl: './dialog-user-info.component.html',
  styleUrls: ['./dialog-user-info.component.scss']
})
export class DialogUserInfoComponent{

  imageRef: string = '';
  selectedImage: any;
  uploadPercent: Observable<number> | undefined;
  downloadURL$: Observable<string> | undefined;
  emailForm = new FormControl(this.auth.currentEmail, [Validators.required, Validators.email]);
  usernameForm = new FormControl(this.auth.currentUserName, [Validators.required, Validators.minLength(2)]);


  constructor(public dialog: MatDialog, public auth: AuthService, public firestore: AngularFirestore, public storage: AngularFireStorage,
    public spinnerService: SpinnerService) {
  }


  getErrorMessageUsername() {
    if (this.usernameForm.hasError('required'))
      return 'You must enter a Username'
    return this.usernameForm.hasError('minlength') ? 'Not a valid username' : '';
  }


  getErrorMessageEmail() {
    if (this.emailForm.hasError('required'))
      return 'You must enter your Email';
    return this.emailForm.hasError('email') ? 'Not a valid email' : '';
  }


  updateUserInfos() {
    this.auth.updateEmailAndName(this.emailForm.value, this.usernameForm.value, this.downloadURL$);
    // this.auth.updateUserProfileImage(this.downloadURL$);
  }


  onFileSelected(event: any, userId: string): void {
    this.selectedImage = event.target.files[0];
    this.uploadImage(userId);
  }


  async uploadImage(userId: string) {
    if (!this.selectedImage) {
      return;
    }

    const previousImageRef = this.storage.ref(`users/${userId}/profile-picture`);
    if (previousImageRef) {
      try {
        previousImageRef.delete()
      } catch (error) {
        console.log(`Previous profile picture does not exist: ${error}`);
      }
    }

    const filePath = `users/${userId}/profile-picture`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.selectedImage);



    this.uploadPercent = task.percentageChanges().pipe(map(percent => percent ?? 0));


    task
      .snapshotChanges()
      .pipe(
        finalize(async () => {
          this.downloadURL$ = fileRef.getDownloadURL();
          console.log('File uploaded and exists at', this.downloadURL$);
        })
      )
      .subscribe();
  }



}
