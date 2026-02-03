import { Injectable } from '@angular/core';
import { ApiService } from '../API/api.service';
import { environment } from '../../../environments/environment';
import { HttpParams } from '@angular/common/http';

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

// Interface para as transações
export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'WITHDRAW' | 'DEPOSIT' | 'TRANSFER';
  transactionDate: string;
  category: number;
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

  // Novo método para buscar dados históricos sem interferir nos outros endpoints
  getTransactionsHistory(startDate: string, endDate: string) {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('size', 1000); // Busca volume maior para cobrir o período

    return this.api.get<any>(`${this.apiUrl}/transactions/`, params);
  }
}
