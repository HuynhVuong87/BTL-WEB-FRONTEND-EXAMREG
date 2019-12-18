import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable/lib/components/datatable.component';
import { MatInput, MatDialog } from '@angular/material';
import { MakeRequest } from 'src/app/_services/request.service';
import { helperService } from 'src/app/_services/helper.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogViewStudentsOfRoomComponent } from '../dialog/dialog-view-students-of-room/dialog-view-students-of-room.component';
import { Session } from 'src/app/_models/course.model';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {
  id: string;
  session: Session;
  selected = [];
  mode = 'edit';
  @ViewChild('table', { static: true }) table: DatatableComponent;
  // tslint:disable-next-line: variable-name
  @ViewChild('focus_input', { static: false }) focus_input: ElementRef;
  rows = [];
  isEditable = {};
  constructor(
    private router: ActivatedRoute,
    private request: MakeRequest,
    private helper: helperService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) {
    this.id = this.router.snapshot.params.id;
  }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    this.spinner.show();
    const url = this.helper.rootUrl + 'session/get-one-session/' + this.id;
    const sub = (await this.request.GETmethod({ url })).subscribe(
      res => {
        this.session = res;
        console.log(res);
        console.log(res.rooms);
        this.rows = res.rooms || [];
        this.helper.subRoom().subscribe(rooms => {
          this.rows.forEach(element => {
            const check = rooms.find(x => x.id === element.id);
            element.booked = check ? check.students_uid.length : 0;
          });
        });
        delete this.session.room;
        sub.unsubscribe();
        this.spinner.hide();
      },
      err => {
        this.helper.noty('error', 5000, err.message);
      }
    );
  }

  // Open/close panel
  sinhvien(row) {
    console.log(row);
    if (row.booked > 0) {
      this.dialog.open(DialogViewStudentsOfRoomComponent, {
        data: {
          room: row,
          sess: this.session
        }
      });
    } else {
      alert('Phòng thi này chưa có sinh viên nào đăng kí');
    }

  }
  editRow(rowIndex) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    this.focus_input.nativeElement.focus();
  }
  // Save row
  async save(row, rowIndex) {

    if (row.place.length > 0 && row.room_num !== null) {
      const url = this.helper.rootUrl + 'session/modify-room-in-session';
      const body = row;
      body.mode = this.mode;
      body.session_id = this.id;
      body.id = body.id || '';
      this.spinner.show();
      console.log(body);
      const sub = (await this.request.POSTmethod({ url, body })).subscribe(res => {
        this.isEditable[rowIndex] = !this.isEditable[rowIndex];
        this.mode = 'edit';
        this.spinner.hide();
        sub.unsubscribe();
        this.getData();
        this.helper.noty('success', 2000, res.message);
      }, err => {
        console.log(err);
        this.spinner.hide();
        this.helper.noty('error', 5000, err.error ? err.error.message : 'CÓ LỖI...');
      });
    } else {
      alert('Vui lòng nhập đủ trường yêu cầu');
    }
  }
  // Delete row
  async delete(row, rowIndex) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    const r = confirm('Xóa phòng thi này khỏi ca thi ?');
    if (r === true) {
      const url = this.helper.rootUrl + 'session/modify-room-in-session';
      const body = row;
      body.mode = 'delete';
      body.session_id = this.id;
      this.spinner.show();
      const sub = (await this.request.POSTmethod({ url, body })).subscribe(res => {

        this.rows.splice(rowIndex, 1);
        this.mode = 'edit';
        this.spinner.hide();
        this.helper.noty('success', 2000, res.message);
        sub.unsubscribe();
      }, err => {
        this.spinner.hide();
        this.helper.noty('error', 5000, err.error ? err.error.message : 'CÓ LỖI...');
      });

    }
  }

  createRoom() {
    if (this.rows.findIndex(x => x.place === '') === -1) {
      this.rows.push({
        room_num: null,
        place: '',
        length: 0
      });
      this.rows = [...this.rows];
      this.mode = 'add';
    } else {
      alert('Vui lòng nhập đủ thông tin ở phòng thi đang có');
    }
  }
}
