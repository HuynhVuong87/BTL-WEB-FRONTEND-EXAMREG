import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { helperService } from 'src/app/_services/helper.service';

@Component({
  selector: 'app-dialog-create-term',
  templateUrl: './dialog-create-term.component.html',
  styleUrls: ['./dialog-create-term.component.scss']
})
export class DialogCreateTermComponent implements OnInit {

  constructor(private helper: helperService, public dialogRef: MatDialogRef<DialogCreateTermComponent>,
    // tslint:disable-next-line: align
    @Inject(MAT_DIALOG_DATA) public data) {

  }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  addFrom(type: string, event: MatDatepickerInputEvent<Date>) {
    if (type === 'change') {
      const datechange = this.helper.create_milisec(event.value);
      const now = this.helper.create_milisec((new Date()).getDate() + '/' + (new Date()).getMonth() + '/' + (new Date()).getFullYear());
      console.log(datechange, now);
      if (datechange <= now) {
        this.data.from = '';
        this.helper.noty('error', 4000, 'Vui lòng chọn ngày hợp lý: Ngày hiện tại < ngày bắt đầu < ngày kết thúc');
      }
      // this.data.date = event.value;
    }
  }
  addTo(type: string, event: MatDatepickerInputEvent<Date>) {
    if (type === 'change') {
      const datechange = this.helper.create_milisec(event.value);
      console.log(datechange);
      console.log(this.data.from);
      if (this.data.from === undefined || this.data.from === '' || datechange < this.helper.create_milisec(this.data.from)) {
        this.data.to = '';
        this.helper.noty('error', 4000, 'Vui lòng chọn ngày hợp lý: Ngày hiện tại < ngày bắt đầu < ngày kết thúc');
      }
      // this.data.date = event.value;
    }
  }
  create() {
    if (this.data.name && this.data.from && this.data.to) {
      {
        this.dialogRef.close(this.data);
      }
    } else { this.helper.noty('error', 4000, 'VUI LÒNG NHẬP ĐỦ VÀ ĐÚNG THÔNG TIN KÌ THI'); }

  }

}
