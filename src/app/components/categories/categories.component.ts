import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DeleteModalComponent } from '../util/delete-modal/delete-modal.component';
import { CategoriesService, Category } from '../../services/categories/categories.service';
import { itemAnimation } from '../../animations/ItemAnimation';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CreateCategoryModalComponent } from './create-category-modal/create-category-modal.component';

@Component({
  selector: 'app-categories',
  imports: [
    MatIconModule,
    CommonModule,
    DeleteModalComponent,
    TranslateModule,
    CreateCategoryModalComponent
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
  animations: [itemAnimation]
})
export class CategoriesComponent{
  private translate = inject(TranslateService);

  categories: Category[] = [];

  categoriesLoaded = false;

  showCreateCategoryModal = false;
  showDeleteModal = false;

  selectedCategory: Category | null = null;


  constructor(
    private categoriesService: CategoriesService,
    private toastr: ToastrService,
  ) { }

  loaded: boolean = false;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.loaded = false;

    this.categoriesService.getCategoriesCached().subscribe({
      next: (data) => {
        this.categories = data;
        this.categoriesLoaded = true;
        this.loaded = true;
      },
      error: () => {
        this.loaded = true;
        this.translate
          .get('categoryManagement.notifications.errorFetchingCategories')
          .subscribe((message: string) => {
            this.toastr.error(message);
          });
      }
    });
  }

  openCreateCategoryModal(): void {
    if (!this.categoriesLoaded) {
      this.toastr.warning('Carregando categorias, tente novamente');
      return;
    }

    this.selectedCategory = null;
    this.showCreateCategoryModal = true;
  }


  openDeleteCategoryModal(): void {
    this.showDeleteModal = true;
  }

  onEditCategory(category: Category): void {
    this.selectedCategory = category;
    this.showCreateCategoryModal = true;
  }

  onDeleteCategory(category: Category): void {
    this.selectedCategory = category;
    this.showDeleteModal = true;
  }

  handleDeleteCategoryConfirm(): void {
    if (!this.selectedCategory) return;

    this.categoriesService
      .deleteCategory(this.selectedCategory.id)
      .subscribe(() => {
        this.toastr.success(
          this.translate.instant('categoryManagement.notifications.categoryDeleteSuccess')
        );
        this.resetModals();
        this.loadCategories();
      });
  }

  handleDeleteCategoryCancel(): void {
    this.resetModals();
  }

  resetModals() {
    this.showCreateCategoryModal = false;
    this.showDeleteModal = false;
    this.selectedCategory = null;
  }

  handleSaveCategory(data: { description: string }) {
    if (this.selectedCategory) {
      this.categoriesService
        .updateCategory(this.selectedCategory.id, data)
        .subscribe(() => {
          this.toastr.success('Categoria atualizada');
          this.resetModals();
          this.loadCategories();
        });
    } else {
      this.categoriesService
        .createCategory(data)
        .subscribe(() => {
          this.toastr.success('Categoria criada');
          this.resetModals();
          this.loadCategories();
        });
    }
  }


}
