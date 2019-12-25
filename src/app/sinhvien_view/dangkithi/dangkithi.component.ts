import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FirebaseAuthServices } from 'src/app/_services/firebase-auth.service';
import { MakeRequest } from 'src/app/_services/request.service';
import { helperService } from 'src/app/_services/helper.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { MatDialog } from '@angular/material';
import { DialogPrintDangkithiComponent } from 'src/app/_components/dialog/dialog-print-dangkithi/dialog-print-dangkithi.component';
import { StudentsImport } from 'src/app/_models/studens-import.models';

@Component({
  selector: 'app-dangkithi',
  templateUrl: './dangkithi.component.html',
  styleUrls: ['./dangkithi.component.scss']
})
export class DangkithiComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;
  @ViewChild('time', { static: true }) time: TemplateRef<any>;
  @ViewChild('lengthView', { static: true }) lengthView: TemplateRef<any>;
  @ViewChild('checkbox', { static: true }) checkbox: TemplateRef<any>;
  uid: string;
  noti = '';
  rows: any = [];
  cols: any;
  selected: any[] = [];
  textSearch = '';
  data: any;
  temp: any;
  count: number;
  user: StudentsImport;
  constructor(
    private authService: FirebaseAuthServices,
    private request: MakeRequest,
    private helper: helperService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog) { }

  async ngOnInit() {
    this.cols = [
      {
        name: 'ĐK',
        width: 30,
        cellTemplate: this.checkbox
      },
      {
        prop: 'course.code',
        name: 'MÃ HỌC PHẦN'
      },
      {
        prop: 'course.name',
        name: 'TÊN HỌC PHẦN'
      },
      {
        prop: 'course.teacher',
        name: 'GIÁO VIÊN'
      },
      // {
      //   prop: 'course.of',
      //   name: 'THUỘC NHÓM'
      // },
      {
        prop: 'session.name',
        name: 'TÊN CA THI'
      },
      {
        prop: 'session.from',
        name: 'THỜI GIAN',
        cellTemplate: this.time
      },
      {
        prop: 'room.place',
        name: 'PHÒNG'
      },
      {
        name: 'SỐ LƯỢNG',
        cellTemplate: this.lengthView
      }
    ];
    this.data = await this.getData();
    this.helper.subRoom().subscribe(rooms => {
      this.rows = [];
      console.log(rooms);
      this.data.forEach(element => {
        element.room.length = rooms.find(x => x.id === element.room.id).length;
        const check = rooms.find(x => x.id === element.room.id).students_uid;
        element.room.booked = check ? check.length : 0;
        if (check && check.includes(this.uid)) {
          element.selected = true;
          element.sbd = rooms.find(x => x.id === element.room.id).students_uid.indexOf(this.uid) + 1;
        }
        // if (element.room.booked !== element.room.length) {
        //   this.rows.push(element);
        // } else {
        //   this.rows.splice(this.rows.findIndex(x => x.room.id === element.room.id), 1);
        // }

        // console.log(this.table.rows);
      });
      this.rows = [...this.data];
      this.count = this.rows.filter(x => x.selected).length;
      this.temp = this.rows;
    });
  }
  onSelect(e, selected) {
    e.preventDefault();
    this.spinner.show();
    console.log(selected);
    if (selected.selected) {
      const q = confirm('BẠN CÓ CHẮC CHẮN MUỐN LOẠI BỎ ?');
      if (q) {
        this.dangkiphongthi(selected, true);
      } else {
        this.spinner.hide();
      }
    } else {
      this.dangkiphongthi(selected, false);
    }
  }

  async dangkiphongthi(selected, out) {
    this.spinner.show();
    const url = this.helper.rootUrl + 'dkthi/booked-room/' + this.uid + (out ? '?out=true' : '');
    console.log(url);
    (await this.request.POSTmethod({
      url, body: {
        uid: this.uid,
        room_id: selected.room.id,
        course_id: selected.course.id
      }
    })).subscribe(
      res => {
        this.spinner.hide();
        selected.selected = !selected.selected;
        this.helper.noty('success', 2000, 'THÀNH CÔNG!');
        this.count = this.rows.filter(x => x.selected).length;
      }, err => {
        this.spinner.hide();
        console.log(err);
        this.helper.noty('error', 3000, err.error.message);
      });
  }

  searchCourse() {
    if (this.textSearch !== '') {
      // tslint:disable-next-line: max-line-length
      this.rows = this.temp.filter(x => x.course.name.toLowerCase().includes(this.textSearch.toLowerCase()) || x.course.code.toLowerCase().includes(this.textSearch.toLowerCase()));
    } else {
      this.rows = this.temp;
    }
  }
  getData() {
    return new Promise(r => {
      this.spinner.show();
      const sub = this.authService.user$.subscribe(async user => {
        if (user !== null) {
          console.log(user.value);
          this.uid = user.value.uid;
          sub.unsubscribe();
          const url = this.helper.rootUrl + 'dkthi/get-sessions-for-user/' + this.uid;
          const dataSub = (await this.request.GETmethod({ url })).subscribe(
            res => {
              if (res.data.length > 0) {
                console.log(res);
                this.user = res.user;
                r(res.data);
              } else {
                this.noti = 'no_course_for_register';
              }
              dataSub.unsubscribe();
              this.spinner.hide();
            },
            err => {
              console.log(err);
              this.helper.noty('error', 10000000, err.error.message);
              this.spinner.hide();
            }
          );
        }
      });
    });

  }
  print() {
    this.dialog.open(DialogPrintDangkithiComponent, {
      data: {
        sinhvien: this.user,
        rooms: this.rows.filter(x => x.selected)
      }
    });
  }
}
