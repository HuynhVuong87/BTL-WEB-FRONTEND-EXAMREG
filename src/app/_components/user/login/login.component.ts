import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgForm } from '@angular/forms';
import { helperService } from 'src/app/_services/helper.service';
// import { SignService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';
import { FirebaseAuthServices } from 'src/app/_services/firebase-auth.service';

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
  hide = true;
  username = '';
  ngAfterViewInit(): void {
  }

  // tslint:disable-next-line: max-line-length
  constructor(private helper: helperService, private router: Router, private fbAuthServices: FirebaseAuthServices) { }

  logIn(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.fbAuthServices.signIn(form.value.username, form.value.password).then(() => {
      form.resetForm();
      this.router.navigate(['/']);
      // .then(() => {
      //   window.location.reload();
      // });
    }).catch(err => {
      this.helper.noty('error', 3000, err.code);
    });
    // this.authService.signIn(form.value.username, form.value.password)
    //   .then((res: any) => {
    //     console.log(res);
    //     if (res.message === 'Auth successful') {
    //       form.resetForm();
    //       this.router.navigate(['/']);
    //     }
    //   }).catch(err => {
    //     this.helper.openSnackBar(err.error.message ? err.error.message : 'CÓ LỖI XẢY RA...', 'OK');
    //     if (err.status === 402) {
    //       form.controls.password.reset();
    //       this.passElement.nativeElement.focus();
    //     } else { form.resetForm(); }
    //   });
  }
  logout() {
    this.fbAuthServices.logOut();
  }
  resetPass() {
    this.fbAuthServices.resetPass(this.username).then((email) => {
      this.helper.noty('success', 10000, 'Vui lòng kiểm tra email: ' + email + ' để xác nhận đổi mật khẩu mới')
    });
  }
}
