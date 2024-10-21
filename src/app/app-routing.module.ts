import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './page/home-page/home-page.component';
import { LoginPageComponent } from './page/login-page/login-page.component';
import { RegisterPageComponent } from './page/register-page/register-page.component';
import { BookingPageComponent } from './page/booking-page/booking-page.component';
import { ContactPageComponent } from './page/contact-page/contact-page.component';
import { NewsPageComponent } from './page/news-page/news-page.component';
import { RoomPageComponent } from './page/room-page/room-page.component';
import { RoomManageComponent } from './manage/room-manage/room-manage.component';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'home', component:HomePageComponent},
  {path: 'login', component:LoginPageComponent },
  {path: 'register', component:RegisterPageComponent },
  {path: 'booking', component:BookingPageComponent },
  {path: 'contact', component:ContactPageComponent},
  {path: 'news', component:NewsPageComponent },
  {path: 'room', component: RoomPageComponent},
  {path: 'room-manage', component: RoomManageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
