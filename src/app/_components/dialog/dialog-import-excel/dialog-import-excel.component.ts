import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-dialog-import-excel',
  templateUrl: './dialog-import-excel.component.html',
  styleUrls: ['./dialog-import-excel.component.scss']
})
export class DialogImportExcelComponent implements OnInit {
  ourFile: File;
  constructor(public dialogRef: MatDialogRef<DialogImportExcelComponent>,
    // tslint:disable-next-line: align
    @Inject(MAT_DIALOG_DATA) public data) {

  }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  openInput() {
    // your can use ElementRef for this later
    document.getElementById('fileInput').click();
  }
  fileChange(files: File[]) {
    if (files.length > 0) {
      this.ourFile = files[0];
      let workBook = null;
      let jsonData = null;
      const reader = new FileReader();
      const file = this.ourFile;
      reader.onload = (event) => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary' });
        jsonData = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet, {raw: false});
          return initial;
        }, {});
        this.data = jsonData[Object.keys(jsonData)[0]];
      };
      reader.readAsBinaryString(file);
    }
  }


}
