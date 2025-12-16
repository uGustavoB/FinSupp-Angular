import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { itemAnimation } from '../../animations/ItemAnimation';
import { Transaction, TransactionsService } from '../../services/transactions/transactions.service';
import { CategoriesService, Category } from '../../services/categories/categories.service';
import { Account, AccountsService } from '../../services/accounts/accounts.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CreateTransactionData, CreateTransactionModalComponent } from './create-transaction-modal/create-transaction-modal.component';
import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from '../util/delete-modal/delete-modal.component';

@Component({
  selector: 'app-transactions',
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    CreateTransactionModalComponent,
    DeleteModalComponent
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
  animations: [itemAnimation]
})
export class TransactionsComponent implements OnInit {
  categories: Category[] = [];
  accounts: Account[] = [];

  openMenuTransactionId: number | null = null;

  showCreateTransactionModal = false;
  showDeleteTransactionModal = false;

  selectedTransaction: Transaction | null = null;

  private translate = inject(TranslateService);

  loaded: boolean = false;

  currentPage: number = 0;
  totalPages: number = 1;

  transactions: Transaction[] = [];

  categoriesDescriptions = new Map<number, string>();
  accountsDescriptions = new Map<number, string>();

  accountsLoaded = false;
  categoriesLoaded = false;


  constructor(
    private transactionsService: TransactionsService,
    private categoriesService: CategoriesService,
    private accountsService: AccountsService,
    private toastr: ToastrService
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
        this.currentPage = pagination ? pagination?.currentPage : 0;
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
        this.categories = response; // 👈 ESSENCIAL

        response.forEach(category => {
          this.categoriesDescriptions.set(category.id, category.description);
        });
      },
      error: (err) => {
        console.error('Erro ao buscar categorias', err);
      }
    });
  }

  getCategoryDescription(categoryId: number): string {
    return this.categoriesDescriptions.get(categoryId) || 'general.loading';
  }

  loadAccounts() {
    const accountsSignal = this.accountsService.getAccountsSignal();

    if (accountsSignal.length > 0) {
      this.accounts = accountsSignal;
      this.accountsLoaded = true;

      accountsSignal.forEach(account => {
        this.accountsDescriptions.set(account.id, account.description);
      });
    }
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

  openCreateTransactionModal() {
    this.loadAccounts();
    this.loadCategories();
    this.showCreateTransactionModal = true;
  }



  handleSaveTransaction(data: CreateTransactionData) {
    if (this.selectedTransaction) {
      // ✏️ EDIT
      this.transactionsService
        .updateTransaction(this.selectedTransaction.id, data)
        .subscribe(() => {
          this.toastr.success('Transação atualizada com sucesso');
          this.resetModals();
          this.loadTransactions(this.currentPage);
        });
    } else {
      // ➕ CREATE
      this.transactionsService.createTransaction(data).subscribe(() => {
        this.toastr.success('Transação criada com sucesso');
        this.resetModals();
        this.loadTransactions(this.currentPage);
      });
    }
  }

  resetModals() {
    this.showCreateTransactionModal = false;
    this.showDeleteTransactionModal = false;
    this.selectedTransaction = null;
  }

  confirmDeleteTransaction() {
    if (!this.selectedTransaction) return;

    this.transactionsService
      .deleteTransaction(this.selectedTransaction.id)
      .subscribe(() => {
        this.toastr.success('Transação excluída com sucesso');
        this.resetModals();
        this.loadTransactions(this.currentPage);
      });
  }


  handleCancelTransaction() {
    this.showCreateTransactionModal = false;
  }


  nextPage() {
    this.currentPage++;
    this.loadTransactions(this.currentPage);
  }

  previousPage() {
    this.currentPage--;
    this.loadTransactions(this.currentPage)
  }

  toggleMenu(id: number) {
    this.openMenuTransactionId =
      this.openMenuTransactionId === id ? null : id;
  }

  closeMenu() {
    this.openMenuTransactionId = null;
  }

  onEditTransaction(transaction: Transaction) {
    this.selectedTransaction = transaction;
    this.showCreateTransactionModal = true;
    this.closeMenu();
  }

  onDeleteTransaction(transaction: Transaction) {
    this.selectedTransaction = transaction;
    this.showDeleteTransactionModal = true;
    this.closeMenu();
  }
}
