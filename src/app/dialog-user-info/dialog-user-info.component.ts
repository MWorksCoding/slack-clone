import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { finalize, map, Observable } from 'rxjs';
import { AuthService } from '../shared/auth.service';


@Component({
  selector: 'app-dialog-user-info',
  templateUrl: './dialog-user-info.component.html',
  styleUrls: ['./dialog-user-info.component.scss']
})
export class DialogUserInfoComponent {
  selectedImage: any;
  uploadPercent: Observable<number> | undefined;
  downloadURL: Observable<string> | undefined;
  updatedEmail: string = '';
  updatedUserName: string = '';
  emailForm = new FormControl('', [Validators.required, Validators.email]);
  usernameForm = new FormControl('', [Validators.required, Validators.minLength(2)]);


  constructor(public dialog: MatDialog, public auth: AuthService, public firestore: AngularFirestore, public storage: AngularFireStorage) {
    this.updatedEmail = this.auth.currentEmail;
    this.updatedUserName = this.auth.currentUserName;
  }


  updateUserInfos() {
    this.auth.updateEmailAndName(this.updatedEmail, this.updatedUserName);
  }


  onFileSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }


  uploadImage() {
    if (!this.selectedImage) {
      return;
    }
    const filePath = `profile-pictures/${Date.now()}_${this.selectedImage.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.selectedImage);

    this.uploadPercent = task.percentageChanges().pipe(map(percent => percent ?? 0));

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
        })
      )
      .subscribe();
  }
  
}