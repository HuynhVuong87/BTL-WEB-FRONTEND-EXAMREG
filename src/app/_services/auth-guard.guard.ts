import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
// import { SignService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
import { FirebaseAuthServices } from './firebase-auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseAuth } from '@angular/fire';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  constructor(private router: Router, private authService: FirebaseAuthServices, private auth: AngularFireAuth) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return true
    console.log(this.authService.authenticated);
    if (this.authService.authenticated) { return true; }

    return this.authService.currentUserObservable
         .take(1)
         .map(user => !!user)
         .do(loggedIn => {
           if (!loggedIn) {
             this.router.navigate(['/login']);
           }
       });
    // return new Observable<boolean>((observer) => {
    //   this.authService.get().subscribe((data: any) => {
    //     const roles = next.data.roles as Array<number>;
    //     console.log(data);
    //     if (data !== null && roles.includes(data.role)) {
    //       observer.next(true);
    //     } else {
    //       this.router.navigate(['/login']);
    //       observer.next(false);
    //       observer.complete();
    //     }
    //   });
    // });
  }
}
