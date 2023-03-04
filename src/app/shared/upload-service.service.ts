import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UploadTaskSnapshot } from '@angular/fire/compat/storage/interfaces';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { __await } from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class UploadServiceService {


  constructor(public storage: AngularFireStorage) { }

  
  selectedImage: string = 'assets/img/name-icon.png';
  public url$ = new BehaviorSubject<string>('assets/img/name-icon.png');


  onFileSelected(event: any, userId: string): void {
    this.selectedImage = event.target.files[0];
    this.uploadImage(userId);
  }


  async uploadNewImage(userId: string | undefined) {
    const filePath = `users/${userId}/profile-picture`;
    const storageFile = this.storage.ref(filePath);
    const imageUrl = "assets/img/name-icon.png";
    const response = await fetch(imageUrl);
    const file = await response.blob();
    let uploadTask = storageFile.put(file);

    uploadTask.then((snapshot) => {
      snapshot.ref.getDownloadURL()
      .then((downloadURL: string) => {
        this.url$?.next(downloadURL);
      })
    })
  }


  async uploadImage(userId: string | undefined) {
    const filePath = `users/${userId}/profile-picture`;
    const storageFile = this.storage.ref(filePath);
    try {
      const url = await lastValueFrom(storageFile.getDownloadURL());
      if (storageFile)
        storageFile.delete()
    }

    catch (error) {
      console.log(`Previous profile picture does not exist: ${error}`);
    }

    const task = await this.storage.upload(filePath, this.selectedImage);
    this.getUrl(task);
  }


  async getUrl(task: UploadTaskSnapshot) {
    const url = await task.ref.getDownloadURL();
    this.url$.next(url);
    console.log('url service', this.url$);
  }
}
