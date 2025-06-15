import { Injectable } from '@angular/core';
import { ApiService } from '../API/api.service';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private apiUrl = environment.apiUrl;

  constructor(private api: ApiService) { }

  getCategories(): Observable<Category[]> {
    return this.api.get(`${this.apiUrl}/categories/`);
  }
}
