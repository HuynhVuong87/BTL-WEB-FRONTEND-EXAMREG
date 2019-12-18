import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Inject
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogCreateCourseComponent } from '../dialog/dialog-create-course/dialog-create-course.component';
import { helperService } from 'src/app/_services/helper.service';
import { MakeRequest } from 'src/app/_services/request.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { FirebaseAuthServices } from 'src/app/_services/firebase-auth.service';
import { SelectionType } from '@swimlane/ngx-datatable';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-ds-hocphan',
  templateUrl: './ds-hocphan.component.html',
  styleUrls: ['./ds-hocphan.component.scss']
})
export class DsHocphanComponent implements OnInit {
  @ViewChild('accessLink', { static: true }) accessLink: TemplateRef<any>;
  @ViewChild('activeTemplate', { static: true }) activeTemplate: TemplateRef<
    any
  >;

  rows: any = [];
  columns: any = [];
  courses: any = [];
  codes: any = [];
  selectCourse = new FormControl();
  selectStatus = new FormControl();
  data: any = [];
  rowsTemp: any = [];
  selected = [];
  SelectionType = SelectionType;
  checkCourseInNoTerm = false;

  // tslint:disable-next-line: max-line-length
  constructor(
    private authService: FirebaseAuthServices,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private helper: helperService,
    private request: MakeRequest,
    private router: Router
  ) { }

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
        width: 54,
        displayCheck: 'active'
      },
      {
        prop: 'course_of',
        name: 'KHÓA HỌC'
      },
      {
        prop: 'course_name',
        name: 'TÊN HỌC PHẦN'
      },
      {
        prop: 'course_code',
        name: 'MÃ HỌC PHẦN',
        width: 35,
        cellTemplate: this.accessLink
      },
      {
        prop: 'course_teacher',
        name: 'GIÁO VIÊN'
      },
      {
        prop: 'studentCount',
        name: 'SỐ LƯỢNG',
        width: 35
      },
      {
        prop: 'active',
        name: 'TRẠNG THÁI',
        cellTemplate: this.activeTemplate,
        width: 50
      }, {
        prop: 'in_term.name',
        name: 'THUỘC KÌ THI'
      },
    ];
    this.spinner.show();
    const timer = setInterval(() => {
      if (this.authService.idToken.toString() !== '') {
        clearInterval(timer);
        this.getData();
      }
    });
  }
  async changeStatus(id, active) {
    // if (last !== active) {
    const c = confirm('Bạn có chắc chắn muốn đổi trạng thái môn học này');
    if (c) {
      this.spinner.show();
      const url = this.helper.rootUrl + 'course/update-one-course/' + id;
      (await this.request.POSTmethod({ url, body: { active } })).subscribe(
        res => {
          this.getData();
          this.spinner.hide();
        },
        err => {
          this.helper.openSnackBar(err.message, 'OK');
        }
      );
    } else {
      this.getData();
    }
  }
  displayCheck(row) {
    return row.active;
  }
  async setTermForCourses() {
    if (this.checkCourseInNoTerm === true) {
      const url = this.helper.rootUrl + 'term/get-all-terms-active';
      (await this.request.GETmethod({ url })).subscribe(
        res => {
          const dialogRef = this.dialog.open(DialogSearchTerm, {
            width: '450px',
            data: {
              terms_avaiable: res,
              term: {
                name: ''
              }
            }
          });

          dialogRef.afterClosed().subscribe(async result => {
            if (result) {
              console.log(result);
              this.spinner.show();
              const url1 = this.helper.rootUrl + 'course/set-term-for-courses';
              const body = {
                courses: this.selected.map(x => {
                  return {
                    id: x.id,
                    course_name: x.course_name,
                    course_code: x.course_code
                  };
                }),
                term: result.term
              };
              console.log(body);
              (await this.request.POSTmethod({ url: url1, body })).subscribe(
                res1 => {
                  this.helper.noty('success', 3000, 'Ghép khóa học cho kì thi thành công');
                  this.spinner.hide();
                  this.getData();
                }, err => {
                  this.helper.openSnackBar(err.message, 'OK');
                });
            }
          });
        },
        err => {
          this.helper.openSnackBar(err.message, 'OK');
        }
      );
    } else {
      this.helper.noty(
        'error',
        4000,
        'Học phần được chọn phải chưa được ghép ở bất kì kì thi nào!'
      );
    }
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);

    this.checkCourseInNoTerm =
      this.selected.filter(x => x.term_id && x.term_id.length > 0).length > 0
        ? false
        : true;
  }
  async getData() {
    this.courses = [];
    this.codes = [];
    this.data = [];
    this.rows = [];
    // this.selected = [];
    const url = this.helper.rootUrl + 'course/get-all-courses';
    (await this.request.GETmethod({ url })).subscribe(
      res => {
        res.forEach(element => {
          element.studentCount = (element.students ? element.students.length : 0) + ' SINH VIÊN';
          if (!this.courses.includes(element.course_of)) {
            this.courses.push(element.course_of);
          }
          if (!this.codes.includes(element.course_code)) {
            this.codes.push(element.course_code);
          }
        });
        this.data = res;
        this.rows = this.data;
        this.rowsTemp = this.rows;
        this.spinner.hide();
      },
      err => {
        this.helper.openSnackBar(err.message, 'OK');
        this.router.navigate(['/login']);
      }
    );
  }

  createCourse() {
    const dialogRef = this.dialog.open(DialogCreateCourseComponent, {
      width: '450px',
      data: {
        name: 'TẠO LỚP MÔN HỌC',
        codes: this.codes,
        courses: this.courses
      },
      disableClose: true
    });

    // tslint:disable-next-line: deprecation
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        const url = this.helper.rootUrl + 'course/add-one-course';
        const body = {
          course_name: result.data.course_name.toUpperCase(),
          course_code: result.data.course_code.toUpperCase(),
          course_teacher: result.data.course_teacher
            .toLowerCase()
            .split(' ')
            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' '),
          course_of: result.data.course_of.toUpperCase()
        };

        (await this.request.POSTmethod({ url, body })).subscribe(
          res => {
            this.helper.noty('success', 3000, 'TẠO THÀNH CÔNG KHÓA HỌC...');
            this.getData();
          },
          err => {
            this.helper.openSnackBar(
              err.error ? err.error.message : 'CÓ LỖI...',
              'OK'
            );
          }
        );
      }
    });
  }

  selectedCourse() {
    if (this.selectCourse.value.length > 0) {
      const options = {
        course_of: this.selectCourse.value
      };
      this.rows = this.data.filter(obj =>
        Object.keys(options).some(key => {
          if (key !== 'course_of') {
            return obj[key] === options[key];
          } else {
            return options[key].some(s => s === obj[key]);
          }
        })
      );
    } else {
      this.rows = this.data;
    }
    this.rowsTemp = this.rows;
  }

  onSearchChange(searchValue: string): void {
    if (searchValue !== '') {
      this.rows = this.helper.fullTextSearch(this.rowsTemp, searchValue, [
        'course_name',
        'course_code',
        'course_teacher'
      ]);
    } else {
      this.rows = this.rowsTemp;
    }
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-search-term.html'
})
// tslint:disable-next-line: component-class-suffix
export class DialogSearchTerm implements OnInit {
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  constructor(
    public dialogRef: MatDialogRef<DialogSearchTerm>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    if (value !== null) {
      const filterValue = value.toLowerCase();
      return this.data.terms_avaiable.filter(option =>
        option.name.toLowerCase().includes(filterValue)
      );
    }
  }
  onEnter(evt: any, select) {
    this.data.term = select;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
