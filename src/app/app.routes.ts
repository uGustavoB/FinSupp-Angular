import { Routes } from '@angular/router';
import { DefaultLoginLayoutComponent } from './components/default-login-layout/default-login-layout.component';
import { MainLayoutComponent } from './components/core/main-layout/main-layout.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { CategoriesComponent } from './components/categories/categories.component';

export const routes: Routes = [
  {
    path: "",
    component: MainLayoutComponent,
    children: [
      {
        path: "accounts",
        component: AccountsComponent
      },
      {
        path: "categories",
        component: CategoriesComponent
      }
    ]
  },
  {
    path: "auth",
    component: DefaultLoginLayoutComponent
  }
];
