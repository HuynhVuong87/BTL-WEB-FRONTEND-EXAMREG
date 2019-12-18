import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { helperService } from 'src/app/_services/helper.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-create-course',
  templateUrl: './dialog-create-course.component.html',
  styleUrls: ['./dialog-create-course.component.scss']
})
export class DialogCreateCourseComponent implements OnInit {

  courseOf = new FormControl();
  filteredOptions: Observable<string[]>;
  constructor(private helper: helperService, public dialogRef: MatDialogRef<DialogCreateCourseComponent>,
    // tslint:disable-next-line: align
    @Inject(MAT_DIALOG_DATA) public data) {

  }

  ngOnInit() {
    this.filteredOptions = this.courseOf.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.data.courses.filter(option => option.toLowerCase().includes(filterValue));
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  create(): void {
    this.data.course_of = this.courseOf.value;
    if (this.data.course_code && this.data.course_name && this.data.course_of && this.data.course_teacher) {

      if (this.data.codes.includes(this.data.course_code)) {
        this.helper.openSnackBar('MÃ MÔN HỌC ĐÃ TỒN TẠI', 'OK');
      } else {
        this.dialogRef.close(
          {
            event: 'CreateOneCourse',
            data: this.data
          });
      }
    } else { this.helper.openSnackBar('VUI LÒNG NHẬP ĐỦ THÔNG TIN MÔN HỌC', 'OK'); }

  }

}
