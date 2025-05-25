import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DefaultLoginLayoutComponent } from './components/default-login-layout/default-login-layout.component';
import { SidebarComponent } from './components/core/sidebar/sidebar.component';
import { NavbarComponent } from './components/core/navbar/navbar.component';
import { MainLayoutComponent } from './components/core/main-layout/main-layout.component';
import { AccountsComponent } from './components/accounts/accounts.component';

export const routes: Routes = [
  {
    path: "",
    component: MainLayoutComponent,
    children: [
      {
        path: "accounts",
        component: AccountsComponent
      }
    ]
  },
  {
    path: "auth",
    component: DefaultLoginLayoutComponent
  }
];
