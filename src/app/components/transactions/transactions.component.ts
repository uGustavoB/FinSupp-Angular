import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { itemAnimation } from '../../animations/ItemAnimation';
import { Transaction, TransactionsService } from '../../services/transactions/transactions.service';
import { CategoriesService, Category } from '../../services/categories/categories.service';
import { AccountsService } from '../../services/accounts/accounts.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-transactions',
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
  animations: [itemAnimation]
})
export class TransactionsComponent implements OnInit {
  private translate = inject(TranslateService);

  loaded: boolean = false;

  currentPage: number = 0;
  totalPages: number = 1;

  transactions: Transaction[] = [];

  categoriesDescriptions = new Map<number, string>();
  accountsDescriptions = new Map<number, string>();

  constructor(
    private transactionsService: TransactionsService,
    private categoriesService: CategoriesService,
    private accountsService: AccountsService
  ) {}

  ngOnInit() {
    this.loadAccounts();
    this.loadTransactions(this.currentPage);
  }

  loadTransactions(page: number) {
    this.loaded = false;
    this.transactionsService.getTransactions(page).subscribe({
      next: ({data, pagination}) => {
        this.transactions = data;
        this.loaded = true;
        this.currentPage = pagination ? pagination?.currentPage : 1;
        this.totalPages = pagination ? pagination?.totalPages : 1;
        this.loadCategories();
      },
      error: (err) => {
        this.loaded = true;
        console.error('Erro ao buscar transações', err)
      }
    });
  }

  loadCategories() {
    this.categoriesService.getCategoriesCached().subscribe({
      next: (response) => {
        response.forEach(category => {
          this.categoriesDescriptions.set(category.id, category.description);
        });
      },
      error (err) {
        console.error('Erro ao buscar categorias', err);
      },
    });
  }

  getCategoryDescription(categoryId: number): string {
    return this.categoriesDescriptions.get(categoryId) || 'general.loading';
  }

  loadAccounts() {
    this.accountsService.getAccountsSignal().forEach(account => {
      this.accountsDescriptions.set(account.id, account.description);
    });
  }

  getAccountDescription(accountId: number): string {
    let account = this.accountsDescriptions.get(accountId);

    if (!account) {
      const accountData = this.accountsService.getAccountByIdSignal(accountId);
      if (accountData) {
        account = accountData.description;
        this.accountsDescriptions.set(accountId, accountData.description);
        return accountData.description;
      }
    }

    return account ? account : 'general.loading';
  }

  nextPage() {
    this.currentPage++;
    this.loadTransactions(this.currentPage);
  }

  previousPage() {
    this.currentPage--;
    this.loadTransactions(this.currentPage)
  }
}
