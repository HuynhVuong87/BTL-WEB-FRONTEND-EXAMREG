import { Component, OnInit, Inject } from '@angular/core';
import { helperService } from 'src/app/_services/helper.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CourseForSession, Session } from 'src/app/_models/course.model';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker/public_api';

@Component({
  selector: 'app-dialog-create-session',
  templateUrl: './dialog-create-session.component.html',
  styleUrls: ['./dialog-create-session.component.scss'],
  animations: [
    trigger('EnterLeave', [
      state('flyIn', style({ transform: 'translateY(0)' })),
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('0.5s 300ms ease-in')
      ])
    ])
  ]
})
export class DialogCreateSessionComponent implements OnInit {
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  dataCourses: CourseForSession[] = [];
  idSelectCourse: string;
  // buoi = 'am';
  selected = [];
  // sessionName: string = '';
  // date: any;
  rows: any = [];
  columns: any = [];
  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#fff',
      buttonColor: '#000',
      primaryFontFamily: 'Dosis'
    },
    dial: {
      dialBackgroundColor: '#fff',
      dialActiveColor: '#000',
      dialEditableActiveColor: '#000',
      dialInactiveColor: '#000',
      dialEditableBackgroundColor: '#edf7ff'
    }
  };
  constructor(
    private helper: helperService,
    public dialogRef: MatDialogRef<DialogCreateSessionComponent>,
    // tslint:disable-next-line: align
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.data.selected = this.data.selected || [];
  }

  ngOnInit() {

    this.columns = [
      {
        prop: 'selected',
        name: '',
        sortable: false,
        canAutoResize: false,
        draggable: false,
        resizable: false,
        headerCheckboxable: true,
        checkboxable: true,
        width: 54
      },
      {
        prop: 'course_name',
        name: 'TÊN HỌC PHẦN',
        width: 450
      },
      {
        prop: 'course_code',
        name: 'MÃ HỌC PHẦN'
      }
    ];
    setTimeout(() => {
      this.rows = this.data.courses;
      this.rows = [...this.rows];
    }, 100);
  }
  onSelect({ selected }) {
    this.data.selected.splice(0, this.data.selected.length);
    this.data.selected.push(...selected);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    if (type == 'change') {
      const datechange = this.helper.create_milisec(event.value);

      if (this.data.from <= datechange && datechange <= this.data.to) {

      } else {
        this.data.date = '';
        this.helper.noty('error', 4000, 'Vui lòng chọn ngày của ca thi phải nằm trong thời gian diễn ra kì thi này.');
      }
      // this.data.date = event.value;
    }
  }
  createSession() {

    if (
      this.data.name &&
      this.data.name.length > 0 &&
      this.data.date &&
      this.data.from &&
      this.data.duration > 0 &&
      this.data.selected.length > 0
    ) {
      this.data.name.replace('_', ' ');
      this.dialogRef.close(this.data);
    } else {
      alert('Vui lòng điền đầy đủ thông tin và chọn ít nhất một học phần');
    }
  }
}
