import { Component, OnInit } from '@angular/core';
import { MakeRequest } from 'src/app/_services/request.service';
import { helperService } from 'src/app/_services/helper.service';

@Component({
  selector: 'app-ds-sinhvien',
  templateUrl: './ds-sinhvien.component.html',
  styleUrls: ['./ds-sinhvien.component.scss']
})
export class DsSinhvienComponent implements OnInit {
  rows: any = [];
  columns = [
    {
      prop: 'ho',
      name: 'Họ Và'
    },
    {
      prop: 'ten',
      name: 'Tên'
    },
    {
      prop: 'gender',
      name: 'Giới Tính'
    },
    {
      prop: 'email',
      name: 'Email'
    },
    {
      prop: 'username',
      name: 'Tên Đăng Nhập'
    },
    {
      prop: 'mssv',
      name: 'MÃ SỐ SV'
    }
  ];
  constructor(private request: MakeRequest, private helper: helperService) { }

  ngOnInit() {
    const url = 'http://localhost:8000/profile/get_all';
    this.request.GETmethod({ url, headers: { withCredentials: true } }).subscribe(res => {
      res.map(x => {
        x.ho = x.fullName.split(' ').slice(0, -1).join(' ');
        x.ten = x.fullName.split(' ').slice(-1).join(' ');
      });
      this.rows = res;
    }, err => {
      this.helper.openSnackBar(err.error ? err.error.message : 'CÓ LỖI...', 'OK');
    });
  }

}
