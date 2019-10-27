import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgForm } from '@angular/forms';
import { SignService } from 'src/app/_services/auth.service';
import { MakeRequest } from 'src/app/_services/request.service';
import { helperService } from 'src/app/_services/helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
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
export class RegisterComponent implements OnInit {
  constructor(private authService: SignService, private request: MakeRequest, private helper: helperService, private router: Router) {


    // const url = 'http://localhost:3000/products';

    // this.request.GETmethod({ url, headers: { withCredentials: true } }).subscribe(data => {
    //   console.log(data);
    // }, err => {
    //   console.log(err);
    //   this.helper.openSnackBar(err.error.message ? err.error.message : 'Có Lỗi Xảy Ra...', 'OK');
    // });
  }

  ngOnInit() {
  }

  register(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.signUp(form.value.username, form.value.email, form.value.password, form.value.fullName, form.value.mssv)
      .then(res => {
        this.router.navigate(['/login']);
        form.resetForm();

      }).catch(err => {
        this.helper.openSnackBar(err.error.message, 'OK');
      });
  }

}
