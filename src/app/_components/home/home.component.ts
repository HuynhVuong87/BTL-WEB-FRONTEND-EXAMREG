import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserProfile } from 'src/app/_models/auth.models';
import { FirebaseAuthServices } from 'src/app/_services/firebase-auth.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  title = 'examReg';
  mode: string;
  sub: Subscription;
  constructor(private authService: FirebaseAuthServices) {

  }

  ngOnInit() {
    this.title = 'abc';
    this.getData();
  }

  getData() {
    //
    this.sub = this.authService.user$.subscribe((data: UserProfile) => {
      data = data['value'];
      if (data !== null) {
        this.mode = data.role === 1 ? 'admin' : 'sinhvien';
      } else { this.mode = undefined; }

    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
