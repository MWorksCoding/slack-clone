import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadServiceService {

  constructor(public storage: AngularFireStorage) { }

  selectedImage: any = 'assets/img/name-icon.png';
  public url$: BehaviorSubject<string> | undefined;

  onFileSelected(event: any, userId: string): void {
    this.selectedImage = event.target.files[0];
    this.uploadImage(userId);
  }


  async uploadImage(userId: string | undefined) {
    const filePath = `users/${userId}/profile-picture`;
    const storageFile = this.storage.ref(filePath);
    try {
      const url = await lastValueFrom(storageFile.getDownloadURL());
      console.log('URL', url);
      if (storageFile)
        storageFile.delete()
    }

    catch (error) {
      console.log(`Previous profile picture does not exist: ${error}`);
    }



    const task = await this.storage.upload(filePath, this.selectedImage);
    this.getUrl(task);
  }


  async getUrl(task: any) {
    const url = await task.ref.getDownloadURL();
    this.url$ = url;
    console.log('url service', this.url$);
  }
}
