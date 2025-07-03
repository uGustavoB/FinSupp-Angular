import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from '../API/api.service';
import { CreateAccountData } from '../../components/inputs/create-accont-modal/create-accont-modal.component';

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

  private bankSignal = signal<Bank[]>([]);
  private accountSignal = signal<Account[]>([]);
  private accountsLoaded = signal(false);

  constructor(private api: ApiService) {}

  getAccountsSignal(): Account[] {
    if (!this.accountsLoaded()) {
      this.loadAccounts();
    }
    return this.accountSignal();
  }

  // Getters
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

  // Fetch
  fetchAccountById(id: number): void {
    this.api.get<Account>(`${this.apiUrl}/accounts/${id}`).subscribe({
      next: (account) => {
        const exists = this.accountSignal().some(a => a.id === account.id);
        if (!exists) {
          this.accountSignal.update(accounts => [...accounts, account]);
        }
      },
      error: (err) => {
        console.error(`Erro ao buscar conta com ID ${id}`, err);
      }
    });
  }

  // Reset
  resetAccounts(): void {
    this.accountSignal.set([]);
    this.accountsLoaded.set(false);
  }

  // LOADERS
  loadAccounts(): void {
    this.api.get<Account[]>(`${this.apiUrl}/accounts/`).subscribe({
      next: accounts => {
        this.accountSignal.set(accounts);
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
    this.api.get<Bank[]>(`${this.apiUrl}/bank/`).subscribe({
      next: banks => {
        this.bankSignal.set(banks);
      },
      error: err => {
        console.error('Erro ao carregar bancos:', err);
      }
    });
  }

  // CRUD
  createAccount(account: CreateAccountData): Observable<Account> {
    return this.api.post<Account>(`${this.apiUrl}/accounts/`, account).pipe(
      tap(newAccount => {
        this.accountSignal.update(accounts => [...accounts, newAccount]);
      })
    );
  }

  deleteAccount(id: number): Observable<void> {
    return this.api.delete<void>(`${this.apiUrl}/accounts/${id}`).pipe(
      tap(() => {
        this.accountSignal.update(accounts => accounts.filter(acc => acc.id !== id));
      })
    );
  }

  updateAccount(account: Account): Observable<Account> {
    return this.api.put<Account>(`${this.apiUrl}/accounts/${account.id}`, account).pipe(
      tap(updated => {
        this.accountSignal.update(accounts =>
          accounts.map(acc => acc.id === updated.id ? updated : acc)
        );
      })
    );
  }
}
