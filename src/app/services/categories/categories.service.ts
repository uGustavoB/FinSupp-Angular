import { Injectable } from '@angular/core';
import { ApiService } from '../API/api.service';
import { environment } from '../../../environments/environment';
import { map, Observable, of, tap } from 'rxjs';

export interface Category {
  id: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private apiUrl = environment.apiUrl;
  private categoryCache = new Map<number, Category>();

  constructor(private api: ApiService) { }

  getCategories(): Observable<Category[]> {
    return this.api.get<Category[]>(`${this.apiUrl}/categories/`).pipe(
      tap(categories => {
        categories.forEach(category => this.categoryCache.set(category.id, category));
      })
    );
  }


  getCategoryById(id: number): Observable<Category> {
    const cached = this.categoryCache.get(id);

    if (cached) {
      return of(cached);
    }

    return this.api.get<Category[]>(`${this.apiUrl}/categories/?id=${id}`).pipe(
      map(categories => categories[0]) // Pega o primeiro da lista
    );
  }
}
