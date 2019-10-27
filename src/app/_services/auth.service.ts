import { UserSignUp, UserProfile } from '../_models/auth.models';
import { MakeRequest } from './request.service';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subject, Observable } from 'rxjs';
import { helperService } from './helper.service';

@Injectable()
export class SignService {
  private user: UserSignUp;
  public userForGuard: any;
  private userUpdated = new Subject<UserProfile>();

  constructor(public request: MakeRequest, private cookie: CookieService, private helper: helperService) {
    let data = {
      signed: false
    };
    if (this.cookie.check('userData')) {
      data = (JSON.parse(this.cookie.get('userData')));
    }
    console.log(data);
    this.userUpdated.next(data);
  }

  getUserInCookie() {
    return new Promise(r => {
      if (this.cookie.check('userData')) {
        r(JSON.parse(this.cookie.get('userData')));
      } else {
        r({
          signed: false
        });
      }
    });

  }

  getDataAuth() {

    return (this.userUpdated.asObservable());
  }

  signUp(username: string, email: string, password: string, fullName: string, mssv: string) {
    this.user = {
      username,
      email,
      password,
      fullName,
      mssv
    };
    const url = 'http://localhost:8000/user/signup';
    return new Promise(async (r, j) => {
      this.request.POSTmethod({ url, body: this.user }).subscribe(res => {
        r(res);
      }, err => j(err));
    });
  }

  signIn(username: string, password: string) {
    const userSignIn = {
      username,
      email: '',
      password
    };
    const url = 'http://localhost:8000/user/login';
    return new Promise(async (r, j) => {
      this.request.POSTmethod({ url, body: userSignIn }).subscribe(res => {
        delete res.data.password;
        delete res.data._v;
        res.data.roleName = this.helper.RoleName.find(x => x.id === res.data.role).name;
        this.cookie.set('userData', JSON.stringify(res.data));
        this.userUpdated.next(res.data);
        r(res);
      }, err => j(err));
    });
  }

  getMyProfile(id: string) {
    return new Promise((r, j) => {
      const url = 'http://localhost:8000/user/' + id;
      this.request.GETmethod({ url, headers: {} }).subscribe(res => {
        r(res);
      },
      err => j(err));
    });
  }

  signOut(id: string) {
    return new Promise(async (r, j) => {
      const url = 'http://localhost:8000/user/logout';
      this.request.POSTmethod({ url, body: { _id: id } }).subscribe(res => {
        this.userUpdated.next({
          signed: false
        });
        this.cookie.delete('userData');
        r(res);
      }, err => j(err));
    });
  }
}
