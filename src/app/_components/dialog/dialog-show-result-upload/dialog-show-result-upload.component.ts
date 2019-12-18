import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-show-result-upload',
  templateUrl: './dialog-show-result-upload.component.html',
  styleUrls: ['./dialog-show-result-upload.component.scss']
})
export class DialogShowResultUploadComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogShowResultUploadComponent>,
    // tslint:disable-next-line: align
    @Inject(MAT_DIALOG_DATA) public data) {
      console.log(data.result);
    }

  ngOnInit() {
  }

}
