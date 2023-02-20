import { Component } from '@angular/core';
import { SpinnerService } from '../shared/spinner.service';

@Component({
  selector: 'app-overlay-spinner',
  templateUrl: './overlay-spinner.component.html',
  styleUrls: ['./overlay-spinner.component.scss']
})
export class OverlaySpinnerComponent {


  constructor(public spinnerService: SpinnerService) { }

}
