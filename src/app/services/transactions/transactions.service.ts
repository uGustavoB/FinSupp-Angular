import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from '../API/api.service';
import { Observable, of, tap, map, catchError } from 'rxjs';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  addToBill: boolean;
  installments: number;
  transactionDate: string;
  type: 'WITHDRAW' | 'DEPOSIT' | 'TRANSFER';
  category: number;
  accountId: number;
  recipientAccountId?: number;
}

export interface TransactionPagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface CreateTransactionData {
  description: string;
  amount: number;
  transactionDate: string;
  type: 'WITHDRAW' | 'DEPOSIT' | 'TRANSFER';
  addToBill: boolean;
  installments: number;
  category: number;
  accountId: number;
  recipientAccountId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  private apiUrl = environment.apiUrl;
  private transactionCache = new Map<number, Transaction>();

  constructor(private api: ApiService) {}

  /* =========================
   * LISTA PAGINADA
   * ========================= */
  getTransactions(page: number, size = 20):
    Observable<{ data: Transaction[]; pagination?: TransactionPagination }> {

    return this.api
      .get<any>(`${this.apiUrl}/transactions/?page=${page}&size=${size}`)
      .pipe(
        map(response => {
          console.log('API Response:', response); // DEBUG: Ver a estrutura da resposta

          // Verificar diferentes possíveis estruturas
          let data: Transaction[] = [];
          let pagination: TransactionPagination | undefined;

          if (response.data && Array.isArray(response.data)) {
            // Se response.data já for um array
            data = response.data;
          } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
            // Se for response.data.data
            data = response.data.data;
            pagination = response.data.pagination;
          } else if (response && response.data && Array.isArray(response)) {
            // Se a resposta já for um array direto (pouco provável)
            data = response;
          } else {
            console.warn('Estrutura de resposta inesperada:', response);
            data = [];
          }

          return {
            data,
            pagination
          };
        }),
        tap(result => {
          // Verificar se result.data existe antes de usar forEach
          if (result.data && Array.isArray(result.data)) {
            result.data.forEach(tx =>
              this.transactionCache.set(tx.id, tx)
            );
          }
        }),
        catchError(error => {
          console.error('Erro ao buscar transações:', error);
          return of({
            data: [],
            pagination: undefined
          });
        })
      );
  }

  /* =========================
   * GET POR ID
   * ========================= */
  getTransactionById(id: number): Observable<Transaction> {
    const cached = this.transactionCache.get(id);
    if (cached) {
      return of(cached);
    }

    return this.api
      .get<any>(`${this.apiUrl}/transactions/${id}`)
      .pipe(
        map(response => {
          console.log('API Response (by ID):', response); // DEBUG
          // Verificar diferentes possíveis estruturas
          if (response.data && response.data.id) {
            return response.data as Transaction;
          } else if (response.data && response.data.data) {
            return response.data.data as Transaction;
          } else if (response && response.data.id) {
            return response.data as Transaction;
          }
          throw new Error('Estrutura de resposta inválida');
        }),
        tap(tx => this.transactionCache.set(tx.id, tx)),
        catchError(error => {
          console.error(`Erro ao buscar transação ${id}:`, error);
          throw error;
        })
      );
  }

  /* =========================
   * CREATE
   * ========================= */
  createTransaction(payload: CreateTransactionData): Observable<Transaction> {
    return this.api
      .post<any>(`${this.apiUrl}/transactions/`, payload)
      .pipe(
        map(response => {
          console.log('API Response (create):', response); // DEBUG
          // Verificar diferentes possíveis estruturas
          if (response.data && response.data.id) {
            return response.data as Transaction;
          } else if (response.data && response.data.data) {
            return response.data.data as Transaction;
          } else if (response && response.id) {
            return response as Transaction;
          }
          throw new Error('Estrutura de resposta inválida');
        }),
        tap(tx => this.transactionCache.set(tx.id, tx)),
        catchError(error => {
          console.error('Erro ao criar transação:', error);
          throw error;
        })
      );
  }

  /* =========================
   * UPDATE
   * ========================= */
  updateTransaction(
    id: number,
    payload: CreateTransactionData
  ): Observable<Transaction> {

    return this.api
      .put<any>(`${this.apiUrl}/transactions/${id}`, payload)
      .pipe(
        map(response => {
          console.log('API Response (update):', response); // DEBUG
          // Verificar diferentes possíveis estruturas
          if (response.data && response.data.id) {
            return response.data as Transaction;
          } else if (response.data && response.data.data) {
            return response.data.data as Transaction;
          } else if (response && response.id) {
            return response as Transaction;
          }
          throw new Error('Estrutura de resposta inválida');
        }),
        tap(tx => this.transactionCache.set(tx.id, tx)),
        catchError(error => {
          console.error(`Erro ao atualizar transação ${id}:`, error);
          throw error;
        })
      );
  }

  /* =========================
   * DELETE
   * ========================= */
  deleteTransaction(id: number): Observable<void> {
    return this.api
      .delete<any>(`${this.apiUrl}/transactions/${id}`)
      .pipe(
        tap(() => this.transactionCache.delete(id)),
        catchError(error => {
          console.error(`Erro ao deletar transação ${id}:`, error);
          throw error;
        })
      );
  }
}
