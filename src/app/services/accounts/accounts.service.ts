import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { CreateAccountData } from '../../components/inputs/create-accont-modal/create-accont-modal.component';

export interface Account {
  id: number;
  description: string;
  bank: number;
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

  private bankSignal = signal<Bank[]>([]);
  private accountSignal = signal<Account[]>([]);
  private accountsLoaded = signal(false);

  constructor(private http: HttpClient) {}

  getAccountsSignal(): Account[] {
    if (!this.accountsLoaded()) {
      this.loadAccounts();
    }
    return this.accountSignal();
  }

  getBanks(): Bank[] {
    if (this.bankSignal().length === 0) {
      this.loadBanks();
    }
    return this.bankSignal();
  }

  getBankNameById(id: number): string {
    const bank = this.bankSignal().find(b => b.id === id);
    return bank ? bank.name : 'Banco Desconhecido';
  }

  getAccountByIdSignal(id: number): Account | undefined {
    return this.accountSignal().find(acc => acc.id === id);
  }

  fetchAccountById(id: number): void {
    this.http.get<Account>(`${this.apiUrl}/accounts/${id}`).subscribe({
      next: response => {
        const exists = this.accountSignal().some(a => a.id === response.id);
        if (!exists) {
          this.accountSignal.update(accounts => [...accounts, response]);
        }
      },
      error: err => {
        console.error(`Erro ao buscar conta com ID ${id}`, err);
      }
    });
  }

  resetAccounts(): void {
    this.accountSignal.set([]);
    this.accountsLoaded.set(false);
  }

  loadAccounts(): void {
    this.http.get<Account[]>(`${this.apiUrl}/accounts/`).subscribe({
      next: response => {
        this.accountSignal.set(response);
        this.accountsLoaded.set(true);
      },
      error: err => {
        this.accountsLoaded.set(true);
        this.accountSignal.set([]);
        console.error('Erro ao carregar contas:', err);
      }
    });
  }

  loadBanks(): void {
    this.http.get<Bank[]>(`${this.apiUrl}/bank/`).subscribe({
      next: response => {
        this.bankSignal.set(response);
      },
      error: err => {
        console.error('Erro ao carregar bancos:', err);
      }
    });
  }

  createAccount(account: CreateAccountData): Observable<Account> {
    return this.http.post<Account>(`${this.apiUrl}/accounts/`, account).pipe(
      tap(newAccount => {
        this.accountSignal.update(accounts => [...accounts, newAccount]);
      })
    );
  }

  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/accounts/${id}`).pipe(
      tap(() => {
        this.accountSignal.update(accounts => accounts.filter(acc => acc.id !== id));
      })
    );
  }

  updateAccount(account: CreateAccountData): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/accounts/${account.id}`, account).pipe(
      tap(updated => {
        this.accountSignal.update(accounts =>
          accounts.map(acc => acc.id === updated.id ? updated : acc)
        );
      })
    );
  }
}
