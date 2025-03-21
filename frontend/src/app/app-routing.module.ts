import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './page/home-page/home-page.component';
import { LoginPageComponent } from './page/login-page/login-page.component';
import { RegisterPageComponent } from './page/register-page/register-page.component';
import { ContactPageComponent } from './page/contact-page/contact-page.component';
import { NewsPageComponent } from './page/news-page/news-page.component';
import { CarListComponent } from './car-list/car-list.component';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { BookingManageComponent } from './manage/booking-manage/booking-manage.component';
import { AdminPageComponent } from './page/admin-page/admin-page.component';
import { MybookingComponent } from './page/mybooking/mybooking.component';
import { CarManageComponent } from './manage/car-manage/car-manage.component';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'home', component:HomePageComponent},
  {path: 'login', component:LoginPageComponent },
  {path: 'register', component:RegisterPageComponent },
  {path: 'mybooking', component:MybookingComponent},
  {path: 'contact', component:ContactPageComponent},
  {path: 'news', component:NewsPageComponent },
  {path: 'car-manage', component: CarManageComponent},
  {path: 'booking-manage', component: BookingManageComponent},
  {path: 'car-list', component: CarListComponent},
  {path: 'booking-detail', component: BookingDetailComponent},
  {path: 'admin-page', component: AdminPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
