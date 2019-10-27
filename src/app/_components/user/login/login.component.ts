import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgForm } from '@angular/forms';
import { helperService } from 'src/app/_services/helper.service';
import { SignService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('EnterLeave', [
      state('flyIn', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('0.5s 300ms ease-in')
      ]),
      transition(':leave', [
        animate('0.5s ease-out', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})

export class LoginComponent implements AfterViewInit {
  @ViewChild('pass', { static: false }) passElement: ElementRef;
  ngAfterViewInit(): void {
  }

  constructor(private helper: helperService, private authService: SignService, private router: Router) { }

  logIn(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.signIn(form.value.username, form.value.password)
      .then((res: any) => {
        console.log(res);
        if (res.message === 'Auth successful') {
          form.resetForm();
          this.router.navigate(['/']);
        }
      }).catch(err => {
        this.helper.openSnackBar(err.error.message ? err.error.message : 'CÓ LỖI XẢY RA...', 'OK');
        if (err.status === 402) {
          form.controls.password.reset();
          this.passElement.nativeElement.focus();
        } else { form.resetForm(); }
      });
  }
}
