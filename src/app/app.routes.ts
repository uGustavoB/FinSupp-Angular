import { Routes } from '@angular/router';
import { DefaultLoginLayoutComponent } from './components/default-login-layout/default-login-layout.component';
import { MainLayoutComponent } from './components/core/main-layout/main-layout.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { authGuard } from './auth/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: "",
    component: MainLayoutComponent,
    children: [
      {
        path: "dashboard",
        component: DashboardComponent
      },
      {
        path: "accounts",
        component: AccountsComponent
      },
      {
        path: "categories",
        component: CategoriesComponent
      },
      {
        path: "transactions",
        component: TransactionsComponent
      },
      {
        path: "subscriptions",
        component: SubscriptionsComponent
      },
      {
        path: "profile",
        component: ProfileComponent
      },
      {
        path: "invoices",
        component: InvoicesComponent
      }
    ],
    canActivate: [authGuard]
  },
  {
    path: "auth",
    component: DefaultLoginLayoutComponent
  }
];
