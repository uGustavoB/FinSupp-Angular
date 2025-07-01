import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { itemAnimation } from '../../animations/ItemAnimation';
import { Transaction, TransactionsService } from '../../services/transactions/transactions.service';
import { CategoriesService } from '../../services/categories/categories.service';

@Component({
  selector: 'app-transactions',
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
  animations: [itemAnimation]
})
export class TransactionsComponent implements OnInit {
  loaded: boolean = false;
  transactions: Transaction[] = [];
  categoriesDescriptions = new Map<number, string>();

  constructor(
    private transactionsService: TransactionsService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.transactionsService.getTransactions().subscribe({
      next: (trans) => {
        this.transactions = trans;
        this.loadCategoriesForTransactions(trans);
        this.loaded = true;
      },
      error: (err) => console.error('Erro ao buscar transações', err)
    });
  }

  loadCategoriesForTransactions(transactions: Transaction[]) {
    transactions.forEach(transaction => {
      const categoryId = transaction.category;

      if (!this.categoriesDescriptions.has(categoryId)) {
        this.categoriesService.getCategoryById(categoryId).subscribe({
          next: (category) => this.categoriesDescriptions.set(categoryId, category.description),
          error: (err) => console.warn(`Erro ao carregar categoria ${categoryId}`, err)
        });
      }
    })
  }

  getCategoryDescription(categoryId: number): string {
    return this.categoriesDescriptions.get(categoryId) || 'Carregando...';
  }
}
