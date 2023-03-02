import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadServiceService {

  constructor(public storage: AngularFireStorage) { }

  selectedImage: any;
  url$: any;

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
    const task = await this.storage.upload(filePath, this.selectedImage);
    this.getUrl(task);
  }


  async getUrl(task: any) {
    const url = await task.ref.getDownloadURL();
    this.url$ = url;
    console.log('url service', this.url$);
  }
}
