import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from '../API/api.service';
import { Observable, tap } from 'rxjs';
import { Account } from '../accounts/accounts.service';

export interface Transaction {
  id: number,
  description: string,
  amount: number,
  addToBill: boolean,
  installments: number
  transactionDate: string
  type: 'WITHDRAW' | 'DEPOSIT' | 'TRANSFER',
  category: number,
  accountId: number,
  recipientAccountId?: number
}

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  private apiUrl = environment.apiUrl;
  private transactionCache = new Map<number, Transaction>();
  private accountSignal = signal<Account[]>([]);

  constructor(private api: ApiService) { }

  getTransactions(): Observable<Transaction[]> {
    return this.api.get<Transaction[]>(`${this.apiUrl}/transactions/`).pipe(
      tap(transactions => {
        transactions.forEach(tra => this.transactionCache.set(tra.id, tra));
      })
    );
  }

  getTransactionById(id: number): Observable<Transaction> {
    const cached = this.transactionCache.get(id);
    if (cached) {
      return new Observable<Transaction>(subscriber => {
        subscriber.next(cached);
        subscriber.complete();
      });
    }

    return this.api.get<Transaction>(`${this.apiUrl}/transactions/${id}`).pipe(
      tap(transaction => this.transactionCache.set(id, transaction))
    );
  }
}
