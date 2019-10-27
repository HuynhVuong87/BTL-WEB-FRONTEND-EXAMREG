import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './_components/user/login/login.component';
import { RegisterComponent } from './_components/user/register/register.component';
import { HomeComponent } from './_components/home/home.component';
import { AuthGuardGuard } from './_services/auth-guard.guard';
import { DsSinhvienComponent } from './_components/ds-sinhvien/ds-sinhvien.component';
import { DsHocphanComponent } from './_components/ds-hocphan/ds-hocphan.component';
import { DsCathiComponent } from './_components/ds-cathi/ds-cathi.component';
import { DsKithiComponent } from './_components/ds-kithi/ds-kithi.component';
import { UserComponent } from './_components/user/user.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent, canActivate: [AuthGuardGuard], data: {
      roles: [1, 2],
    }
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'user/:id',
    component: UserComponent,
    canActivate: [
      AuthGuardGuard
    ],
    data: {
      roles: [1],
    }
  },
  {
    path: 'ds-sinhvien',
    component: DsSinhvienComponent,
    canActivate: [
      AuthGuardGuard
    ],
    data: {
      roles: [2],
    }
  },
  {
    path: 'ds-hocphan',
    component: DsHocphanComponent,
    canActivate: [
      AuthGuardGuard
    ],
    data: {
      roles: [2],
    }
  },
  {
    path: 'ds-cathi',
    component: DsCathiComponent,
    canActivate: [
      AuthGuardGuard
    ],
    data: {
      roles: [2],
    }
  },
  {
    path: 'ds-kithi',
    component: DsKithiComponent,
    canActivate: [
      AuthGuardGuard
    ],
    data: {
      roles: [2],
    }
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
