import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
// tslint:disable-next-line: class-name
export class helperService {

  public RoleName = [
    {
      id: 0,
      name: 'Người Mới'
    }, {
      id: 1,
      name: 'Sinh Viên'
    }, {
      id: 2,
      name: 'Quản Trị Viên'
    }
  ];
  public gender = [
    {
      id: 0,
      name: 'Không xác định'
    }, {
      id: 1,
      name: 'Nam'
    }, {
      id: 2,
      name: 'Nữ'
    }
  ];

  constructor(private snackBar: MatSnackBar) {

  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }
}
