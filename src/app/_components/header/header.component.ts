import { Component, OnInit, Input } from '@angular/core';
import { SignService } from 'src/app/_services/auth.service';
import { helperService } from 'src/app/_services/helper.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() inputSideNav: MatSidenav;
  user: any = {
    signed: false
  };
  private postSub: Subscription;
  constructor(private authService: SignService, private helper: helperService, private router: Router) {
    this.authService.getUserInCookie().then((data: any) => {
      this.user = data;
    });
  }

  ngOnInit() {
    this.postSub = this.authService.getDataAuth().subscribe((res: any) => {
      this.user = res;
    });
  }
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    this.postSub.unsubscribe();
  }

  logOut() {
    this.authService.signOut(this.user._id).then(res => {
      this.router.navigate(['/login']);
    }).catch(err => {
      this.helper.openSnackBar(err.error ? err.error.message : 'CÓ LỖI', 'OK');
    });
  }
  openProfile(role: number, id: string) {
    if (role === 1) {
      console.log(id);
      this.router.navigate(['/user/' + id]);
    } else { this.helper.openSnackBar('BẠN KHÔNG PHẢI LÀ SINH VIÊN', 'OK'); }
  }
}
