import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-error',
  templateUrl: './dialog-error.component.html',
  styleUrls: ['./dialog-error.component.scss']
})
export class DialogErrorComponent {

  //data message and code shows the error message and the error code in the html component
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string, code: string }) { }
}
