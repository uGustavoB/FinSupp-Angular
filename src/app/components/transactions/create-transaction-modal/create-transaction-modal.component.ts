import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Category } from '../../../services/categories/categories.service';
import { FormsModule } from '@angular/forms';
import { fadeSlide } from '../../../animations/FadeSlide';
import { Account } from '../../../services/accounts/accounts.service';
import { Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

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

@Component({
  selector: 'app-create-transaction-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './create-transaction-modal.component.html',
  animations: [fadeSlide]
})
export class CreateTransactionModalComponent implements OnInit {

  @Input() categories: Category[] = [];
  @Input() accounts: Account[] = [];

  @Output() create = new EventEmitter<CreateTransactionData>();
  @Output() cancel = new EventEmitter<void>();

  @Input() initialData: CreateTransactionData | null = null;
  @Input() isEditMode: boolean = false;


  description = '';
  amount = 0;
  transactionDate = new Date().toISOString().substring(0, 10);
  type: 'WITHDRAW' | 'DEPOSIT' | 'TRANSFER' = 'WITHDRAW';
  addToBill = false;
  installments = 1;
  category!: number;
  accountId!: number;
  recipientAccountId?: number;

  // NOVAS PROPRIEDADES ADICIONADAS:
  typeDropdownOpen = false;
  categoryDropdownOpen = false;
  accountDropdownOpen = false;

  selectedCategory: Category | null = null;
  selectedAccount: Account | null = null;

  ngOnInit() {
    if (this.initialData) {
      this.description = this.initialData.description;
      this.amount = this.initialData.amount;
      this.transactionDate = this.initialData.transactionDate;
      this.type = this.initialData.type;
      this.addToBill = this.initialData.addToBill;
      this.installments = this.initialData.installments;
      this.category = this.initialData.category;
      this.accountId = this.initialData.accountId;
      this.recipientAccountId = this.initialData.recipientAccountId;

      // Inicializar os valores selecionados
      this.initializeSelectedValues();
    }

    // Também inicializar quando os dados são carregados via Input
    if (this.categories && this.category) {
      this.selectedCategory = this.categories.find(c => c.id === this.category) || null;
    }

    if (this.accounts && this.accountId) {
      this.selectedAccount = this.accounts.find(a => a.id === this.accountId) || null;
    }
  }

  // NOVOS MÉTODOS ADICIONADOS:

  // Métodos para alternar dropdowns
  toggleTypeDropdown() {
    this.typeDropdownOpen = !this.typeDropdownOpen;
    // Fechar outros dropdowns
    this.categoryDropdownOpen = false;
    this.accountDropdownOpen = false;
  }

  toggleCategoryDropdown() {
    this.categoryDropdownOpen = !this.categoryDropdownOpen;
    this.typeDropdownOpen = false;
    this.accountDropdownOpen = false;
  }

  toggleAccountDropdown() {
    this.accountDropdownOpen = !this.accountDropdownOpen;
    this.typeDropdownOpen = false;
    this.categoryDropdownOpen = false;
  }

  // Métodos para selecionar valores
  selectType(type: 'WITHDRAW' | 'DEPOSIT' | 'TRANSFER') {
    this.type = type;
    this.typeDropdownOpen = false;
  }

  selectCategory(category: Category) {
    this.category = category.id;
    this.selectedCategory = category;
    this.categoryDropdownOpen = false;
  }

  selectAccount(account: Account) {
    this.accountId = account.id;
    this.selectedAccount = account;
    this.accountDropdownOpen = false;
  }

  // Método para exibir o nome do tipo
  getTypeDisplayName(type: string): string {
    switch(type) {
      case 'WITHDRAW': return 'Saída';
      case 'DEPOSIT': return 'Entrada';
      case 'TRANSFER': return 'Transferência';
      default: return 'Selecione um tipo';
    }
  }

  // Método para inicializar valores selecionados
  private initializeSelectedValues() {
    if (this.categories && this.category) {
      this.selectedCategory = this.categories.find(c => c.id === this.category) || null;
    }

    if (this.accounts && this.accountId) {
      this.selectedAccount = this.accounts.find(a => a.id === this.accountId) || null;
    }
  }

  // Método para fechar todos os dropdowns (opcional, útil para cancelar)
  closeAllDropdowns() {
    this.typeDropdownOpen = false;
    this.categoryDropdownOpen = false;
    this.accountDropdownOpen = false;
  }

  onCreate() {
    this.create.emit({
      description: this.description,
      amount: this.amount,
      transactionDate: this.transactionDate,
      type: this.type,
      addToBill: this.addToBill,
      installments: this.installments,
      category: this.category,
      accountId: this.accountId,
      recipientAccountId: this.recipientAccountId
    });
  }

  onCancel() {
    this.closeAllDropdowns();
    this.cancel.emit();
  }

  // Método para lidar com clique fora dos dropdowns (opcional)
  // Você pode adicionar um HostListener para fechar dropdowns ao clicar fora
  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent) {
  //   // Verificar se o clique foi fora dos dropdowns e fechá-los
  //   // Implementação depende da estrutura específica do seu modal
  // }
}
