import { NgModule } from '@angular/core';
import { BrowserModule, } from '@angular/platform-browser';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactPageComponent } from './page/contact-page/contact-page.component';
import { HomePageComponent } from './page/home-page/home-page.component';
import { LoginPageComponent } from './page/login-page/login-page.component';
import { NewsPageComponent } from './page/news-page/news-page.component';
import { RegisterPageComponent } from './page/register-page/register-page.component';
import { HeaderComponent } from './partials/header/header.component';
import { AuthInterceptor } from './auth.interceptor';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { BookingManageComponent } from './manage/booking-manage/booking-manage.component';
import { AdminPageComponent } from './page/admin-page/admin-page.component';
import { MybookingComponent } from './page/mybooking/mybooking.component';
import { CarManageComponent } from './manage/car-manage/car-manage.component';
import { CarListComponent } from './car-list/car-list.component';
import { NavbarComponent } from './partials/navbar/navbar.component';


@NgModule({
  declarations: [
    AppComponent,
    ContactPageComponent,
    HomePageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    NewsPageComponent,
    HeaderComponent,
    CarListComponent,
    BookingDetailComponent,
    BookingManageComponent,
    AdminPageComponent,
    MybookingComponent,
    CarManageComponent,
    NavbarComponent
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
