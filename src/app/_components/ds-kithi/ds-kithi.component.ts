import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogCreateTermComponent } from '../dialog/dialog-create-term/dialog-create-term.component';
import { helperService } from 'src/app/_services/helper.service';
import { MakeRequest } from 'src/app/_services/request.service';
import { Term } from 'src/app/_models/term.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-ds-kithi',
  templateUrl: './ds-kithi.component.html',
  styleUrls: ['./ds-kithi.component.scss']
})
export class DsKithiComponent implements OnInit {
  terms: Term[];
  tempTerm: any = [];
  textSearch: string;
  // tslint:disable-next-line: max-line-length
  constructor(
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private helper: helperService,
    private request: MakeRequest
  ) {
    this.spinner.show();
  }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    this.spinner.show();
    const url = this.helper.rootUrl + 'term/get-all-terms';
    const sub = (await this.request.GETmethod({ url })).subscribe(
      (res: Term[]) => {
        this.spinner.hide();
        res.map(x => x.sessions = x.sessions || []);
        res = this.helper.sortArrayByKey(res, 'active', 'desc');
        this.terms = res;
        this.tempTerm = this.terms;

        sub.unsubscribe();
      },
      err => {

        this.helper.openSnackBar(err.message, 'OK');
      }
    );

  }
  async disableTerm(id) {

    const r = confirm('Hủy kì thi này?');
    if (r) {

      this.spinner.show();
      const url = this.helper.rootUrl + 'term/modify/' + id + '?active=false';
      (await this.request.POSTmethod({ url, body: {} })).subscribe(
        res => {

          this.spinner.hide();
          this.helper.noty('success', 3000, res.message);
          this.getData();
        },
        err => {

        }
      );
    }
  }
  searchTerm() {
    this.terms = (this.tempTerm.filter(x => x.name.toLowerCase().includes(this.textSearch)));
  }
  createTerm() {
    const dialogRef = this.dialog.open(DialogCreateTermComponent, {
      width: '450px',
      data: {},
      disableClose: true
    });

    // tslint:disable-next-line: deprecation
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        result.from = this.helper.create_milisec(result.from);
        result.to = this.helper.create_milisec(result.to);
        const url = this.helper.rootUrl + 'term/add-one-term';
        (await this.request.POSTmethod({ url, body: result })).subscribe(
          res => {
            this.helper.noty('success', 3000, 'TẠO THÀNH CÔNG KÌ THI...');
            this.getData();
          },
          err => {
            console.log(err);
            this.helper.noty('error', 500000, err.error ? err.error.message ? err.error.message : 'CÓ LỖI..' : 'CÓ LỖI...');
          }
        );
      }
    });
  }
}
