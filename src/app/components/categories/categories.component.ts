import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DeleteModalComponent } from '../util/delete-modal/delete-modal.component';

@Component({
  selector: 'app-categories',
  imports: [
    MatIconModule,
    CommonModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  categories = [
    {
      id: 1,
      description: 'Comida'
    },
    {
      id: 2,
      description: 'Transporte'
    },
    {
      id: 3,
      description: 'Entretenimento'
    },
    {
      id: 4,
      description: 'Saúde'
    },
    {
      id: 5,
      description: 'Educação'
    },
    {
      id: 6,
      description: 'Moradia'
    },
    {
      id: 7,
      description: 'Lazer'
    },
    {
      id: 8,
      description: 'Outros'
    }
  ];

  constructor(private dialog: MatDialog) { }

  openDeleteModal(): void {
    const dialogRef = this.dialog.open(DeleteModalComponent,
      {
        data: {
          name: "Categoria"
        }
      }
    );
  }
}
