import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {


  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();
  private isProgressingSubject = new BehaviorSubject<boolean>(false);
  public isProgressing$ = this.isProgressingSubject.asObservable();


  settProgressingStatus(status: boolean) {
    this.isProgressingSubject.next(status);
  }


  settLoadingStatus(status: boolean) {
    this.isLoadingSubject.next(status);
  }
}
