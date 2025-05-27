import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-delete-modal',
  imports: [
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css'
})
export class DeleteModalComponent {
  constructor(public dialogRef: MatDialogRef<DeleteModalComponent>,) {}

  data = inject(MAT_DIALOG_DATA);

  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    // Gustavo - Futuramente implementar a lógica de exclusão aqui
    this.dialogRef.close(true);
  }
}
