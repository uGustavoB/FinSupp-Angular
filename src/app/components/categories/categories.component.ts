import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DeleteModalComponent } from '../util/delete-modal/delete-modal.component';
import { CategoriesService, Category } from '../../services/categories/categories.service';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';
import { itemAnimation } from '../animations/ItemAnimation';

@Component({
  selector: 'app-categories',
  imports: [
    MatIconModule,
    CommonModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
  animations: [itemAnimation]
})
export class CategoriesComponent {
  categories: Category[] = [];

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog
  ) { }

  loaded: boolean = false;

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loaded = true;
      },
      error: (err) => console.error('Erro ao buscar categorias', err)
    });
  }

  openDeleteModal(): void {
    const dialogRef = this.dialog.open(DeleteModalComponent,
      {
        data: {
          name: "Categoria"
        },
        backdropClass: 'blurred-backdrop'
      }
    );
  }
}
