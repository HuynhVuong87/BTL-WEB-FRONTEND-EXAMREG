import { Component, OnInit } from '@angular/core';
import { FirebaseAuthServices } from './_services/firebase-auth.service';
import { Observable } from 'rxjs';
import { UserProfile } from './_models/auth.models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'examReg';
  _user: Observable<UserProfile>;
  constructor(public authService: FirebaseAuthServices) {

  }

  ngOnInit() {
    // this._user = this.authService.getUserData();
  }

}
