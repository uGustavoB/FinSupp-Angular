import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from '../API/api.service';

export interface Account {
  id: number;
  description: string;
  bank: number;
  accountType: string;
  balance: number;
  closingDay: number;
  paymentDueDay: number;
}

export interface Bank {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private apiUrl = environment.apiUrl;
  private accountCache = new Map<number, Account>();
  private bankSignal = signal<Bank[]>([]);

  constructor(private api: ApiService) { }

  getAccounts(): Observable<Account[]> {
    return this.api.get<Account[]>(`${this.apiUrl}/accounts/`).pipe(
      tap(accounts => {
        accounts.forEach(acc => this.accountCache.set(acc.id, acc));
      })
    );
  }

  getAccountById(id: number): Observable<Account> {
    const cached = this.accountCache.get(id);
    console.log(cached);
    if (cached) {
      return of(cached);
    }

    return this.api.get<Account>(`${this.apiUrl}/accounts/${id}`).pipe(
      tap(account => this.accountCache.set(id, account))
    );
  }

  loadBanks(): void {
    this.api.get<Bank[]>(`${this.apiUrl}/bank/`).subscribe(banks => {
      this.bankSignal.set(banks);
    });
  }

  getBankNameById(id: number): string {
    const bank = this.bankSignal().find(b => b.id === id);
    return bank ? bank.name : 'Banco Desconhecido';
  }
}
