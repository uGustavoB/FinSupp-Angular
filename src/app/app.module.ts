import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AppComponent } from './app.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { DeleteModalComponent } from './components/util/delete-modal/delete-modal.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { CommonModule } from '@angular/common';
import { DialogConfigModule } from './modules/dialog-config.module';
import { AccountsComponent } from './components/accounts/accounts.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    DeleteModalComponent,
    SubscriptionsComponent,
    AccountsComponent,
    CategoriesComponent
  ],
  imports: [
    CommonModule,
    DialogConfigModule,
    MatDialogModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: MAT_ICON_DEFAULT_OPTIONS,
      useValue: { fontSet: 'material-symbols-rounded' }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
