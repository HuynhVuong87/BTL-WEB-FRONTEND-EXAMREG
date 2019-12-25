import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { helperService } from 'src/app/_services/helper.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MakeRequest } from 'src/app/_services/request.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddStudentCourseComponent } from '../../dialog/dialog-add-student-course/dialog-add-student-course.component';
import { DialogImportExcelComponent } from '../../dialog/dialog-import-excel/dialog-import-excel.component';
import { StudentForCourse } from 'src/app/_models/studens-import.models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Course } from 'src/app/_models/course.model';
import { BottomSheetComponent } from '../../bottom-sheet/bottom-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-hocphan',
  templateUrl: './hocphan.component.html',
  styleUrls: ['./hocphan.component.scss']
})
export class HocphanComponent implements OnInit {
  @ViewChild('active', { static: true }) active: TemplateRef<any>;
  id: string;
  rows: any = [];
  columns: any = [];
  dataCourse: Course;
  // tslint:disable-next-line: max-line-length
  constructor(private bottomSheet: MatBottomSheet, private spinner: NgxSpinnerService, public dialog: MatDialog, private helper: helperService, private router: ActivatedRoute, private request: MakeRequest) {
    this.id = this.router.snapshot.params.id;
    this.spinner.show();
  }

  ngOnInit() {
    this.columns = [{
      prop: 'ho',
      name: 'Họ Và',
    },
    {
      prop: 'ten',
      name: 'Tên',
    },
    {
      prop: 'mssv',
      name: 'MSSV',
    }, {
      prop: 'active',
      name: 'ĐƯỢC THI ?',
      cellTemplate: this.active
    },];
    this.getData();
  }

  //lay du lieu cua 1 mon hoc
  async getData() {
    this.spinner.show();
    const url = this.helper.rootUrl + 'course/get-one-course/' + this.id;
    (await this.request.GETmethod({ url })).subscribe(res => {
      res.students = res.students || [];
      res.students.map(x => {
        x.ho = x.fullName.split(' ').slice(0, -1).join(' ');
        x.ten = x.fullName.split(' ').slice(-1).join(' ');
      });
      this.dataCourse = res;
      this.rows = this.dataCourse.students;
      this.spinner.hide();
    }, err => {
      this.helper.openSnackBar(err.error ? err.error.message : 'CÓ LỖI...', 'OK');
    });
  }

  importFromExcels(active: boolean) {

    // {
    const dialogRef = this.dialog.open(DialogImportExcelComponent, {
      width: '750px',
      data: {
        nameTask: 'Nhập sinh viên ' + (active ? 'ĐỦ' : 'KHÔNG') + ' điều kiện dự thi từ file Excels',
        // tslint:disable-next-line: max-line-length
        describe: 'Các cột có vị trí &nbsp;<mark>&nbsp; ĐÚNG THỨ TỰ&nbsp; </mark>&nbsp; như hình dưới (<b>có thể khác tên cột và không có dữ liệu</b>)..<br>Và là dữ liệu trong Sheet &nbsp;<mark>&nbsp; ĐẦU TIÊN &nbsp; </mark>&nbsp;',
        previewImage: 'assets/images/importSVforCourse.jpg',
        data: {}
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result && result.length > 0) {
        this.spinner.show();
        const getDataByOrder = (obj: Object, num: number) => {
          return obj[Object.keys(obj)[num]];
        };
        const data: StudentForCourse[] = [];
        result.forEach(el => {
          data.push({
            fullName: (getDataByOrder(el, 0) || ''),
            mssv: getDataByOrder(el, 1),
            active
          });
        });
        const url = this.helper.rootUrl + 'course/add-student-for-course/' + this.id;
        (await this.request.POSTmethod({
          url, body: {
            data
          }
        })).subscribe(res => {
          this.spinner.hide();
          this.getData();
          this.helper.noty('success', 3000, 'Cập nhật sinh viên cho học phần thành công.');
        }, err => {
          this.helper.noty('error', 5000, err.error.message);
          console.log(err);
          this.spinner.hide();
        });
      }
    });
    // }
  }

  openBottomSheet() {
    const bottomRef = this.bottomSheet.open(BottomSheetComponent, {
      data: {
        data: [{
          active: true,
          name: 'ĐỦ ĐIỀU KIỆN DỰ THI'
        }, {
          active: false,
          name: 'KHÔNG ĐỦ ĐIỀU KIỆN DỰ THI'
        }],
      }
    });
    bottomRef.afterDismissed().subscribe(result => {
      if (result && result.data.active !== undefined) {

        this.importFromExcels(result.data.active);
      }

    });
  }


}
