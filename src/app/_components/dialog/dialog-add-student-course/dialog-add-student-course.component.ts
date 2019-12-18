import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { helperService } from 'src/app/_services/helper.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-add-student-course',
  templateUrl: './dialog-add-student-course.component.html',
  styleUrls: ['./dialog-add-student-course.component.scss']
})
export class DialogAddStudentCourseComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  // tslint:disable-next-line: variable-name
  constructor(private _formBuilder: FormBuilder,
              private helper: helperService,
              public dialogRef: MatDialogRef<DialogAddStudentCourseComponent>,
    // tslint:disable-next-line: align
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

}
