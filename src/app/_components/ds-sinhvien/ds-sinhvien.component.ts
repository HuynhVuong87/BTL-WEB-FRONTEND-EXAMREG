import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MakeRequest } from 'src/app/_services/request.service';
import { helperService } from 'src/app/_services/helper.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogImportExcelComponent } from '../dialog/dialog-import-excel/dialog-import-excel.component';
import { Router } from '@angular/router';
import { StudentsImport } from 'src/app/_models/studens-import.models';
import { FirebaseAuthServices } from 'src/app/_services/firebase-auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogShowResultUploadComponent } from '../dialog/dialog-show-result-upload/dialog-show-result-upload.component';

@Component({
  selector: 'app-ds-sinhvien',
  templateUrl: './ds-sinhvien.component.html',
  styleUrls: ['./ds-sinhvien.component.scss'],
  animations: [
    trigger('EnterLeave', [
      state('flyIn', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s 300ms ease-in')
      ])
    ])
  ]
})
export class DsSinhvienComponent implements OnInit {
  @ViewChild('roleTemplate', { static: true }) roleTemplate: TemplateRef<any>;
  rows: any = [];
  columns: any = [];
  dataImportStudent: StudentsImport[] = [];

  // tslint:disable-next-line: max-line-length
  constructor(private spinner: NgxSpinnerService, private authService: FirebaseAuthServices, public dialog: MatDialog, private request: MakeRequest, private helper: helperService, private router: Router) { }

  ngOnInit() {
    this.columns = [
      {
        prop: 'username',
        name: 'Tên Đăng Nhập',

      }, {
        prop: 'email',
        name: 'Email'
      }, {
        prop: 'ho',
        name: 'Họ Và'
      },
      {
        prop: 'ten',
        name: 'Tên'
      },
      {
        prop: 'gender',
        name: 'Giới Tính',
        width: 70
      },
      {
        prop: 'birthday',
        name: 'Ngày Sinh',
      },
      {
        prop: 'homeTown',
        name: 'Quê Quán'
      },
      {
        prop: 'mssv',
        name: 'MÃ SỐ SV',
        cellTemplate: this.roleTemplate
      }
    ];

    this.getData();
  }

  async getData() {
    this.spinner.show();
    this.rows = [];
    const url = this.helper.rootUrl + 'user/get-all-students';

    (await this.request.GETmethod({ url })).subscribe(res => {
      console.log(res);
      res.map(x => {
        x.gender = x.gender ? this.helper.gender.find(y => y.id === Number(x.gender)).name : 'Chưa đặt';
        x.ho = x.fullName.split(' ').slice(0, -1).join(' ');
        x.ten = x.fullName.split(' ').slice(-1).join(' ');
      });
      this.rows = res;
      this.spinner.hide();
    }, err => {
      this.helper.openSnackBar(err.message, 'OK');
      this.router.navigate(['/login']);
    });
  }

  // them sinh vien tu file excel
  importFromExcels() {

    // mo dialog de upload file excel
    const dialogRef = this.dialog.open(DialogImportExcelComponent, {
      width: '750px',
      data: {
        nameTask: 'Thêm tài khoản sinh viên từ file Excels',
        // tslint:disable-next-line: max-line-length
        describe: 'Các cột có vị trí &nbsp;<mark>&nbsp; ĐÚNG THỨ TỰ&nbsp; </mark>&nbsp; như hình dưới (<b>có thể khác tên cột và không có dữ liệu</b>)..<br>Và là dữ liệu trong Sheet &nbsp;<mark>&nbsp; ĐẦU TIÊN &nbsp; </mark>&nbsp;',
        previewImage: 'assets/images/importSV.jpg',
        data: {}
      }
    });

    // xu ly ket qua tu file excel
    dialogRef.afterClosed().subscribe(async result => {
      if (result && result.length > 0) {
        if (result.length < 200) {
          this.spinner.show();
          const getDataByOrder = (obj: Object, num: number) => {
            return obj[Object.keys(obj)[num]];
          };
          this.dataImportStudent = [];
          // tslint:disable-next-line: prefer-const
          // tslint:disable-next-line: forin
          for (const el of result) {

            // if (this.helper.validateBirthday(getDataByOrder(el, 6))) {
            //   alert('Sai định dạng ngày sinh (dd/mm/yyyy hoặc d/m/yyyy) của sinh viên: ' + getDataByOrder(el, 0));
            //   break;
            // }
            const dataStudent: StudentsImport = {
              username: getDataByOrder(el, 0) || '',
              password: getDataByOrder(el, 1) || '',
              email: getDataByOrder(el, 2) || '',
              fullName: (getDataByOrder(el, 3) || '') + (getDataByOrder(el, 4) || ''),
              gender: this.helper.gender.find(x => x.name === getDataByOrder(el, 5).toUpperCase()).id || 0,
              birthday: getDataByOrder(el, 6) || '',
              homeTown: getDataByOrder(el, 7) || '',
              mssv: getDataByOrder(el, 8) || '',
              cmnd: getDataByOrder(el, 9) || '',
            };

            this.dataImportStudent.push(dataStudent);
          }
          // gui du lieu sang backend
          const url = this.helper.rootUrl + 'user/add-students';
          (await this.request.POSTmethod({
            url, body: {
              data: this.dataImportStudent
            }
          })).subscribe(res => {

            console.log(res);
            if (res.successed) {
              this.spinner.hide();
              this.dialog.open(DialogShowResultUploadComponent, {
                data: {
                  // result: res
                  length: result.length,
                  result: res
                }
              });
              if (res.successed.length > 0) {
                this.getData();
              }
            }

          }, err => {
            console.log(err);
            this.helper.noty('error', 500000, err.error ? err.error.message ? err.error.message : 'CÓ LỖI..' : 'CÓ LỖI...');
          });
        } else { alert('Chỉ được thêm tối đa 200 sinh viên một lần'); }
      }
    });

    // }
  }

}
