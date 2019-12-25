import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-dialog-print-dangkithi',
  templateUrl: './dialog-print-dangkithi.component.html',
  styleUrls: ['./dialog-print-dangkithi.component.scss']
})
export class DialogPrintDangkithiComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogPrintDangkithiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
  }

  ngOnInit() {
  }
  downloadPDF() {
    const data = document.getElementById('print-section');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 10;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('phieuduthi_examReg.pdf'); // Generated PDF
    });
  }
}
