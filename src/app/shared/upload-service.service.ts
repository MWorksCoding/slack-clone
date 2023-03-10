import { Injectable } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask,
  BUCKET,
} from '@angular/fire/compat/storage';
import { UploadTaskSnapshot } from '@angular/fire/compat/storage/interfaces';
import { FieldPath } from 'firebase/firestore';
import { BehaviorSubject, finalize, lastValueFrom, Subscription } from 'rxjs';
import { __await } from 'tslib';

@Injectable({
  providedIn: 'root',
})
export class UploadServiceService {


  constructor(public storage: AngularFireStorage) {}


  public url$ = new BehaviorSubject<string>('assets/img/name-icon.png');


  /**
   * loads default image to storage
   * @param userId {string}
   */
  async uploadNewImage(userId: string | undefined) {
    const filePath = `users/${userId}/profile-picture`;
    const fileRef = this.storage.ref(filePath);
    fileRef.getDownloadURL().subscribe(
      url => {
        console.log(`File ${filePath} exists at ${url}`);
      }
    );


    const imageUrl = 'assets/img/name-icon.png';
    const response = await fetch(imageUrl);
    const file = await response.blob();
    const task = await this.storage.upload(filePath, file);
    this.getUrl(task);
  }


  /**
   * selected file will be passed to uploadImage function
   * @param event {Event} represents a change event
   * @param userId {string}
   */
  onFileSelected(event: any, userId: string): void {
    let selectedImage = event.target.files[0];
    this.uploadImage(userId, selectedImage);
  }


  /**
   * delete existing profile picture from storage and uploads a new profil picture
   * @param userId {string}
   * @param selectedImage {File}
   */
  async uploadImage(userId: string | undefined, selectedImage: File) {
    const filePath = `users/${userId}/profile-picture`;
    const fileRef = this.storage.ref(filePath);
    fileRef.delete();
    const task = await this.storage.upload(filePath, selectedImage);
    this.getUrl(task);
  }


  /**
   * updates url$ with the actual profil picture from storage
   * @param task {UploadTaskSnapshot}
   */
  async getUrl(task: UploadTaskSnapshot) {
    const url = await task.ref.getDownloadURL();
    this.url$.next(url);
  }
}
