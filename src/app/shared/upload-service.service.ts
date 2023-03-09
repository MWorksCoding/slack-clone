import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { UploadTaskSnapshot } from '@angular/fire/compat/storage/interfaces';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { __await } from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class UploadServiceService {


  constructor(public storage: AngularFireStorage) { }


  public url$ = new BehaviorSubject<string>('assets/img/name-icon.png');


    /**
   * loads default image to storage
   * @param userId {string} 
   */
    async uploadNewImage(userId: string | undefined) {
      const filePath = `users/${userId}/profile-picture`;
      const storageFile = this.storage.ref(filePath);
      const imageUrl = "assets/img/name-icon.png";
      const response = await fetch(imageUrl);
      const file = await response.blob();
      let uploadTask = storageFile.put(file);
      this.updateProfilePicture(uploadTask);
    }
  
  
    /**
     * get url from uploadtask and update url$ with it, profile picture will be updated
     * @param uploadTask {AngularFireUploadTask} represents current upload task for the file
     * that is being uploaded to the storage
     */
    updateProfilePicture(uploadTask: AngularFireUploadTask) {
      uploadTask.then((snapshot) => {
        snapshot.ref.getDownloadURL()
          .then((downloadURL: string) => {
            this.url$?.next(downloadURL);
            console.log('url§', downloadURL);
          })
      });
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
    const storageFile = this.storage.ref(filePath);
    if (storageFile)
      storageFile.delete()
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
