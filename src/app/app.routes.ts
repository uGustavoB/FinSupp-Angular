import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DefaultLoginLayoutComponent } from './components/default-login-layout/default-login-layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';

export const routes: Routes = [
  {
    path: "auth",
    component: DefaultLoginLayoutComponent
  },
  {
    path: "sidebar",
    component: SidebarComponent
  },
  {
    path: "navbar",
    component: NavbarComponent
  }
];
