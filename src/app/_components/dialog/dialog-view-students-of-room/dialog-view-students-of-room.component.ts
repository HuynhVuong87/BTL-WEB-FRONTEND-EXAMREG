import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MakeRequest } from 'src/app/_services/request.service';
import { helperService } from 'src/app/_services/helper.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dialog-view-students-of-room',
  templateUrl: './dialog-view-students-of-room.component.html',
  styleUrls: ['./dialog-view-students-of-room.component.scss']
})
export class DialogViewStudentsOfRoomComponent implements OnInit {
  students = [];
  constructor(
    private spinner: NgxSpinnerService,
    private request: MakeRequest,
    private helper: helperService,
    public dialogRef: MatDialogRef<DialogViewStudentsOfRoomComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      spinner.show();
  }

  async ngOnInit() {
    const url = this.helper.rootUrl + 'session/students-in-room/' + this.data.room.id;
    (await this.request.GETmethod({ url })).subscribe(res => {

      res.map(x => {
        x.gender = x.gender ? this.helper.gender.find(y => y.id === Number(x.gender)).name : 'Chưa đặt';
        x.ho = x.fullName.split(' ').slice(0, -1).join(' ');
        x.ten = x.fullName.split(' ').slice(-1).join(' ');
      });
      res.sort((a, b) => (a.ten > b.ten) ? 1 : ((b.ten > a.ten) ? -1 : 0));
      console.log(res);
      this.students = res;
      if (res.length === 0) {
        this.dialogRef.close();
      }
      this.spinner.hide();
    }, err => {
      console.log(err);
      this.dialogRef.close();
      this.spinner.hide();
      this.helper.noty('error', 4000, 'CÓ LỖI');
    });
  }
  print() {
    alert('pẻint')
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
