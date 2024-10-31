import { NgModule } from '@angular/core';
import { BrowserModule, } from '@angular/platform-browser';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookingPageComponent } from './page/booking-page/booking-page.component';
import { ContactPageComponent } from './page/contact-page/contact-page.component';
import { HomePageComponent } from './page/home-page/home-page.component';
import { LoginPageComponent } from './page/login-page/login-page.component';
import { NewsPageComponent } from './page/news-page/news-page.component';
import { RegisterPageComponent } from './page/register-page/register-page.component';
import { HeaderComponent } from './partials/header/header.component';
import { AuthInterceptor } from './auth.interceptor';
import { RoomManageComponent } from './manage/room-manage/room-manage.component';
import { RoomListComponent } from './room-list/room-list.component';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    BookingPageComponent,
    ContactPageComponent,
    HomePageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    NewsPageComponent,
    HeaderComponent,
    RoomManageComponent,
    RoomListComponent,
    BookingDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
