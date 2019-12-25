import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from './app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { NOTYF, notyfFactory } from './_services/noty.token';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';

import { HeaderComponent } from './_components/header/header.component';
import { UserComponent } from './_components/user/user.component';
import { LoginComponent } from './_components/user/login/login.component';
import { HomeComponent } from './_components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
// import { SignService } from './_services/auth.service';
import { MakeRequest } from './_services/request.service';
import { helperService } from './_services/helper.service';
import { CookieService } from 'ngx-cookie-service';
import { DsSinhvienComponent } from './_components/ds-sinhvien/ds-sinhvien.component';
import { DsHocphanComponent, DialogSearchTerm } from './_components/ds-hocphan/ds-hocphan.component';
import { DsCathiComponent } from './_components/ds-cathi/ds-cathi.component';
import { DsKithiComponent } from './_components/ds-kithi/ds-kithi.component';
import { SinhvienComponent } from './_components/ds-sinhvien/sinhvien/sinhvien.component';
import { DialogImportExcelComponent } from './_components/dialog/dialog-import-excel/dialog-import-excel.component';
import { DialogCreateCourseComponent } from './_components/dialog/dialog-create-course/dialog-create-course.component';
import { HocphanComponent } from './_components/ds-hocphan/hocphan/hocphan.component';
import { DialogAddStudentCourseComponent } from './_components/dialog/dialog-add-student-course/dialog-add-student-course.component';


import { NgxPrintModule } from 'ngx-print';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from 'angularx-social-login';
import { FirebaseAuthServices } from './_services/firebase-auth.service';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { DialogShowResultUploadComponent } from './_components/dialog/dialog-show-result-upload/dialog-show-result-upload.component';
import { MatBottomSheet, MatBottomSheetContainer } from '@angular/material';
import { BottomSheetComponent } from './_components/bottom-sheet/bottom-sheet.component';
import { DialogCreateTermComponent } from './_components/dialog/dialog-create-term/dialog-create-term.component';
import { KithiComponent } from './_components/ds-kithi/kithi/kithi.component';
import { DialogCreateSessionComponent } from './_components/dialog/dialog-create-session/dialog-create-session.component';
import { SessionComponent } from './_components/session/session.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DangkithiComponent } from './sinhvien_view/dangkithi/dangkithi.component';
import { AdminHomeComponent } from './_components/admin-home/admin-home.component';
// tslint:disable-next-line: max-line-length
import { DialogViewStudentsOfRoomComponent } from './_components/dialog/dialog-view-students-of-room/dialog-view-students-of-room.component';
import { DialogPrintDangkithiComponent } from './_components/dialog/dialog-print-dangkithi/dialog-print-dangkithi.component';

// Configs
export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
    [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('522052269071-tad8b0tq9kt30bcq18sdgub17l9b96li.apps.googleusercontent.com')
      }
    ]
  );
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UserComponent,
    LoginComponent,
    HomeComponent,
    DsSinhvienComponent,
    DsHocphanComponent,
    DsCathiComponent,
    DsKithiComponent,
    SinhvienComponent,
    DialogImportExcelComponent,
    DialogCreateCourseComponent,
    HocphanComponent,
    DialogAddStudentCourseComponent,
    DialogShowResultUploadComponent,
    BottomSheetComponent,
    DialogCreateTermComponent,
    KithiComponent,
    DialogCreateSessionComponent,
    DialogSearchTerm,
    SessionComponent,
    DangkithiComponent,
    AdminHomeComponent,
    DialogViewStudentsOfRoomComponent,
    DialogPrintDangkithiComponent
  ],
  imports: [
    NgxPrintModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    SocialLoginModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    NgxSpinnerModule,
    FlexLayoutModule,
    NgxMaterialTimepickerModule.setLocale('vi-VN')
  ],
  entryComponents: [DialogImportExcelComponent,
    DialogCreateCourseComponent,
    DialogShowResultUploadComponent,
    DialogAddStudentCourseComponent,
    BottomSheetComponent,
    DialogCreateTermComponent,
    DialogCreateSessionComponent,
    DialogSearchTerm,
    DialogViewStudentsOfRoomComponent,
    DialogPrintDangkithiComponent
  ],
  providers: [MatBottomSheet, AngularFireAuthGuard, MakeRequest, helperService, CookieService, {
    provide: NOTYF, useFactory: notyfFactory
  }, {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
