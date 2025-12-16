import { Injectable } from '@angular/core';
import { ApiService } from '../API/api.service';
import { environment } from '../../../environments/environment';
import { map, Observable, of, tap } from 'rxjs';

export interface Category {
  id: number;
  description: string;
}

export interface CreateCategoryData {
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private apiUrl = environment.apiUrl;
  private categoryCache = new Map<number, Category>();

  constructor(private api: ApiService) {}

  // ========================
  // GET
  // ========================

  getCategories(): Observable<Category[]> {
    return this.api
      .get<Category[]>(`${this.apiUrl}/categories/`)
      .pipe(
        map(res => res.data),
        tap(categories => this.syncCache(categories))
      );
  }

  getAllCategories(): Observable<Category[]> {
    return this.api
      .get<Category[]>(`${this.apiUrl}/categories/?visibility=ALL`)
      .pipe(
        map(res => res.data),
        tap(categories => this.syncCache(categories))
      );
  }

  getCategoriesCached(): Observable<Category[]> {
    if (this.categoryCache.size > 0) {
      return of(Array.from(this.categoryCache.values()));
    }

    return this.getAllCategories();
  }

  getCategoryById(id: number): Observable<Category> {
    const cached = this.categoryCache.get(id);
    if (cached) {
      return of(cached);
    }

    return this.api
      .get<Category[]>(`${this.apiUrl}/categories/?id=${id}&visibility=ALL`)
      .pipe(
        map(res => res.data[0]),
        tap(category => {
          if (category) {
            this.categoryCache.set(category.id, category);
          }
        })
      );
  }

  // ========================
  // CREATE
  // ========================

  createCategory(data: CreateCategoryData): Observable<Category> {
    return this.api
      .post<Category>(`${this.apiUrl}/categories/`, data)
      .pipe(
        map(res => res),
        tap(category => {
          this.categoryCache.set(category.id, category);
        })
      );
  }

  // ========================
  // UPDATE
  // ========================

  updateCategory(
    id: number,
    data: CreateCategoryData
  ): Observable<Category> {
    return this.api
      .put<Category>(`${this.apiUrl}/categories/${id}`, data)
      .pipe(
        map(res => res),
        tap(category => {
          this.categoryCache.set(category.id, category);
        })
      );
  }

  // ========================
  // DELETE
  // ========================

  deleteCategory(id: number): Observable<void> {
    return this.api
      .delete<void>(`${this.apiUrl}/categories/${id}`)
      .pipe(
        tap(() => {
          this.categoryCache.delete(id);
        })
      );
  }

  // ========================
  // HELPERS
  // ========================

  private syncCache(categories: Category[]) {
    this.categoryCache.clear();
    categories.forEach(category =>
      this.categoryCache.set(category.id, category)
    );
  }
}
