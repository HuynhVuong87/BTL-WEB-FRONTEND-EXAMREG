import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AppMaterialModule } from './app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { HeaderComponent } from './_components/header/header.component';
import { UserComponent } from './_components/user/user.component';
import { LoginComponent } from './_components/user/login/login.component';
import { RegisterComponent } from './_components/user/register/register.component';
import { HomeComponent } from './_components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { SignService } from './_services/auth.service';
import { MakeRequest } from './_services/request.service';
import { helperService } from './_services/helper.service';
import { CookieService } from 'ngx-cookie-service';
import { DsSinhvienComponent } from './_components/ds-sinhvien/ds-sinhvien.component';
import { DsHocphanComponent } from './_components/ds-hocphan/ds-hocphan.component';
import { DsCathiComponent } from './_components/ds-cathi/ds-cathi.component';
import { DsKithiComponent } from './_components/ds-kithi/ds-kithi.component';
import { SinhvienComponent } from './_components/ds-sinhvien/sinhvien/sinhvien.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UserComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DsSinhvienComponent,
    DsHocphanComponent,
    DsCathiComponent,
    DsKithiComponent,
    SinhvienComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    NgxDatatableModule
  ],
  providers: [SignService, MakeRequest, helperService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
