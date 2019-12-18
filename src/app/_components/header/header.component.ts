import { Component, OnInit, Input } from '@angular/core';
import { helperService } from 'src/app/_services/helper.service';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { MatSidenav } from '@angular/material';
import { FirebaseAuthServices } from 'src/app/_services/firebase-auth.service';
import { UserProfile } from 'src/app/_models/auth.models';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() inputSideNav: MatSidenav;
  user: UserProfile = null;
  // tslint:disable-next-line: ban-types
  title: String = '';
  postSub: Observable<UserProfile>;
  // tslint:disable-next-line: max-line-length
  constructor(public authService: FirebaseAuthServices, private helper: helperService, private router: Router) {
  }

  toggleSideNav() {
    this.inputSideNav.toggle();
  }

  ngOnInit() {
    console.log();
    const timer = setInterval(() => {
      if (this.title.length > 0) {
        clearInterval(timer);
      }
      this.title = 'ExamReg';
    }, 1000);

    // this.postSub = this.authService.getUserData();
  }
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
  }

  logOut() {
    this.authService.logOut().then(() => {
      this.router.navigate(['/login']);
    }).catch(err => {
      this.helper.openSnackBar(err.error ? err.error.message : 'CÓ LỖI', 'OK');
    });
  }
  // openProfile(role: number, id: string) {
  //   if (role === 1) {
  //
  //     this.router.navigate(['/user/' + id]);
  //   } else { this.helper.openSnackBar('BẠN KHÔNG PHẢI LÀ SINH VIÊN', 'OK'); }
  // }
  gglogin() {

  }
}
