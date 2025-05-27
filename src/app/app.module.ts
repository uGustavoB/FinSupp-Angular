import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AppComponent } from './app.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@NgModule({
  declarations: [],
  imports: [
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    MatDialog,
    MatDialogRef,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-rounded' } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
