import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DeleteModalComponent } from '../util/delete-modal/delete-modal.component';
import { CategoriesService, Category } from '../../services/categories/categories.service';
import { itemAnimation } from '../../animations/ItemAnimation';

@Component({
  selector: 'app-categories',
  imports: [
    MatIconModule,
    CommonModule,
    DeleteModalComponent
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
  animations: [itemAnimation]
})
export class CategoriesComponent {
  categories: Category[] = [];
  showDeleteModal: boolean = false;

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

  openDeleteCategoryModal(): void {
    this.showDeleteModal = true;
  }

  handleDeleteCategoryConfirm(): void {
    this.showDeleteModal = false;
  }

  handleDeleteCategoryCancel(): void {
    this.showDeleteModal = false;
  }
}
