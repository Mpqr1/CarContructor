import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './page/home-page/home-page.component';
import { LoginPageComponent } from './page/login-page/login-page.component';
import { RegisterPageComponent } from './page/register-page/register-page.component';
import { BookingPageComponent } from './page/booking-page/booking-page.component';
import { ContactPageComponent } from './page/contact-page/contact-page.component';
import { NewsPageComponent } from './page/news-page/news-page.component';
import { RoomManageComponent } from './manage/room-manage/room-manage.component';
import { RoomListComponent } from './room-list/room-list.component';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { BookingManageComponent } from './manage/booking-manage/booking-manage.component';
import { AdminPageComponent } from './page/admin-page/admin-page.component';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'home', component:HomePageComponent},
  {path: 'login', component:LoginPageComponent },
  {path: 'register', component:RegisterPageComponent },
  {path: 'booking', component:BookingPageComponent },
  {path: 'contact', component:ContactPageComponent},
  {path: 'news', component:NewsPageComponent },
  {path: 'room-manage', component: RoomManageComponent},
  {path: 'booking-manage', component: BookingManageComponent},
  {path: 'room-list', component: RoomListComponent},
  {path: 'booking-detail', component: BookingDetailComponent},
  {path: 'admin-page', component: AdminPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
