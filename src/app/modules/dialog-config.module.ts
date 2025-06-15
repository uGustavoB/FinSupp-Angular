import { NgModule } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

@NgModule({
  exports: [MatDialogModule],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        backdropClass: 'blurred-backdrop',
        panelClass: 'custom-dialog-container',
      }
    }
  ]
})
export class DialogConfigModule {}
