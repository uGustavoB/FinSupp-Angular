import { Injectable } from '@angular/core';
import { ApiService } from '../API/api.service';
import { environment } from '../../../environments/environment';

export interface DashboardSummary {
  monthlyIncome: number;
  monthlyExpense: number;
  netBalance: number;
  totalSavings: number;
  totalInvestments: number;
  totalValueForActiveSubscriptions: number;
}

export interface CategorySummary {
  category: string;
  totalAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = environment.apiUrl;

  constructor(private api: ApiService) { }

  getSummary() {
    return this.api.get<DashboardSummary>(`${this.apiUrl}/dashboard/summary`);
  }

  getCategorySummary() {
    return this.api.get<CategorySummary[]>(`${this.apiUrl}/dashboard/categories`);
  }
}
