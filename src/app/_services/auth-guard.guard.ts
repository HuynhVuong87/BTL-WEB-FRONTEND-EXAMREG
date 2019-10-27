import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SignService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  constructor(private router: Router, private authService: SignService, cookie: CookieService) {
  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return true
    return new Observable<boolean>((observer) => {
      this.authService.getUserInCookie().then((data: any) => {
        const roles = next.data.roles as Array<number>;
        if (data.signed && roles.includes(data.role)) {
          observer.next(true);
        } else {
          this.router.navigate(['/login']);
          observer.next(false);
          observer.complete();
        }
      });
    });
  }
}
