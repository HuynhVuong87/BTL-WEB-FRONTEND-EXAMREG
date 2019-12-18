import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatSelect } from '@angular/material';
import { DialogCreateSessionComponent } from '../../dialog/dialog-create-session/dialog-create-session.component';
import { helperService } from 'src/app/_services/helper.service';
import { MakeRequest } from 'src/app/_services/request.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-kithi',
  templateUrl: './kithi.component.html',
  styleUrls: ['./kithi.component.scss']
})
export class KithiComponent implements OnInit {
  @ViewChild('selectCourse', { static: false }) selectCourse: MatSelect;
  @ViewChild('date', { static: true }) dateTemplate: TemplateRef<any>;
  @ViewChild('from', { static: true }) fromTemplate: TemplateRef<any>;
  @ViewChild('accessLink', { static: true }) accessLink: TemplateRef<any>;
  @ViewChild('dura', { static: true }) duraTemplate: TemplateRef<any>;
  id: string;
  rows: any = [];
  columns: any = [];
  courses: any = [];
  termName = '';
  selected = [];
  idCourseSelected = '';
  dataCourse: any;
  fromdate: number;
  to: number;
  constructor(
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private helper: helperService,
    private request: MakeRequest,
    private router: ActivatedRoute
  ) {
    this.id = this.router.snapshot.params.id;
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
        width: 54,
      },
      {
        prop: 'name',
        name: 'TÊN CA THI',
        cellTemplate: this.accessLink
      },
      {
        prop: 'date',
        name: 'NGÀY THI',
        cellTemplate: this.dateTemplate
      },
      {
        prop: 'from',
        name: 'GIỜ (24h)',
        cellTemplate: this.fromTemplate
      },
      {
        prop: 'duration',
        name: 'THỜI GIAN LÀM BÀI',
        cellTemplate: this.duraTemplate
      }
    ];
    this.getData();
    const timer = setInterval(() => {
      if (this.selectCourse) {
        clearInterval(timer);
        this.selectCourse.open();
      }
    }, 500);
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  async removeSessionOfCourse() {

    this.spinner.show();
    const url = this.helper.rootUrl + 'session/disable-multi-session-of-a-course';
    const body = {
      term_id: this.id,
      course_id: this.dataCourse.id,
      session_to_remove: this.selected.map(x => x.id)
    };
    const sub = (await this.request.POSTmethod({ url, body })).subscribe(res => {

      this.rows = res.sessions;
      this.rows = [...this.rows];
      this.spinner.hide();
      this.helper.noty('success', 4000, 'Xóa ca thi của học phần thành công');
      sub.unsubscribe();
    }, err => {
      this.helper.noty('error', 4000, err.message);
    });
  }
  async getData() {
    this.spinner.show();
    const url = this.helper.rootUrl + 'term/get-one-term/' + this.id;
    (await this.request.GETmethod({ url })).subscribe(res => {
      this.courses = res.courses || [];
      this.termName = res.name;
      this.fromdate= res.from;
      console.log(res);
      console.log(this.fromdate);
      this.to = res.to;
      this.spinner.hide();
    });
  }

  selectedCourse(id) {
    if (this.dataCourse && id === this.dataCourse.id) {
    } else {
      this.selected = [];
      this.idCourseSelected = id;
      this.dataCourse = this.courses.find(x => x.id === id);
      if (this.dataCourse) {
        this.rows = this.dataCourse.sessions || [];
      }
    }
  }

  async createSession() {
    this.spinner.hide();
    const dialogRef = this.dialog.open(DialogCreateSessionComponent, {
      width: '750px',
      data: {
        courses: this.courses,
        from: this.fromdate,
        to: this.to
      },
      disableClose: true
    });
    // tslint:disable-next-line: deprecation
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.spinner.show();
        delete result.courses;
        result.term_id = this.id;
        result.date = this.helper.create_milisec(result.date);
        //
        console.log(result);
        const url = this.helper.rootUrl + 'session/add-one-session';
        (await this.request.POSTmethod({ url, body: result })).subscribe(res => {
          this.courses = res;
          this.dataCourse = this.courses.find(x => x.id === this.idCourseSelected);
          if (this.dataCourse) {
            this.rows = this.dataCourse.sessions || [];
          }
          this.helper.noty('success', 4000, 'Tạo ca thi thành công!');
          this.spinner.hide();
        }, err => {
          console.log(err);
          this.helper.noty('error', 5000, err.error ? err.error.message : err.message);
          this.spinner.hide();
        });
      }
    });
  }
}
