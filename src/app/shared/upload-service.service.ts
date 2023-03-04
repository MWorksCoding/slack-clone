import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { __await } from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class UploadServiceService {

  constructor(public storage: AngularFireStorage) { }

  selectedImage: any = 'assets/img/name-icon.png';
  public url$: BehaviorSubject<string> | undefined;
  testImage: any;

  onFileSelected(event: any, userId: string): void {
    this.selectedImage = event.target.files[0];
    this.uploadImage(userId);
  }


  async uploadNewImage(userId: string | undefined) {
    const bytes = new Uint8Array(59);
    for (let i = 0; i < 59; i++) {
      bytes[i] = 32 + i;
      
    }

    const filePath = `users/${userId}/profile-picture`;
    const storageFile = this.storage.ref(filePath);

    const imageUrl = URL.createObjectURL(new Blob([bytes.buffer], {type: "image/png"}));
    let file = new File([imageUrl], "assets/img/name-icon.png", {type: "image/png"});
    let uploadTask = storageFile.put(file);

    uploadTask.then((snapshot) => {
      snapshot.ref.getDownloadURL()
      .then(async (downloadURL: any) => {
        this.url$ = await downloadURL;
        console.log('URL$', this.url$);
      })
    })
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



    console.log('selectedImage', this.selectedImage);
    const task = await this.storage.upload(filePath, this.selectedImage);
    this.getUrl(task);
  }


  async getUrl(task: any) {
    console.log('task', task);
    const url = await task.ref.getDownloadURL();
    this.url$ = url;
    console.log('url service', this.url$);
  }
}
