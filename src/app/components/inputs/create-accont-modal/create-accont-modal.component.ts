import { Component, EventEmitter, Input, OnChanges, OnInit, output, Output, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { fadeSlide } from '../../../animations/FadeSlide';
import { Bank } from '../../../services/accounts/accounts.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

export interface CreateAccountData {
  description: string;
  // bank: number;
  balance: number;
  closingDay: number;
  paymentDueDay: number;
  id?: number;
}

@Component({
  selector: 'app-create-account-modal',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './create-accont-modal.component.html',
  styleUrl: './create-accont-modal.component.css',
  animations: [fadeSlide]
})
export class CreateAccountModalComponent implements OnInit, OnChanges {
  constructor(private toastr: ToastrService) {}

  bankDropdownOpen = false;
  accountTypeDropdownOpen = false;

  description: string | null = null;
  initialBalance: number | null = null;
  selectedBank: Bank | null = null;
  selectedAccountType: 'CHECKING' | 'SAVINGS' | 'INVESTMENTS' | null = null;
  closingDay: number | null = null;
  paymentDueDay: number | null = null;
  userId: number | null = null;

  @Input() banks: Bank[] = [];
  @Input() accountTypes: any[] = [];
  @Input() accountToEdit: CreateAccountData | null = null;

  @Output() save = new EventEmitter<CreateAccountData>();
  @Output() cancel = new EventEmitter<void>();

  get isEditMode(): boolean {
    return this.accountToEdit !== null;
  }

  get modalTitle(): string {
    return this.isEditMode ? 'Editar conta' : 'Crie uma conta';
  }

  get modalDescription(): string {
    return this.isEditMode
      ? 'Atualize as informações da sua conta bancária'
      : 'Adicione uma nova conta bancária para acompanhar suas finanças';
  }

  get submitButtonText(): string {
    return this.isEditMode ? 'Atualizar conta' : 'Criar conta';
  }

  ngOnInit(): void {
    if (this.accountToEdit) {
      setTimeout(() => this.populateFormWithAccountData(), 0);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['accountToEdit']) {
      if (this.accountToEdit) {
        setTimeout(() => this.populateFormWithAccountData(), 0);
      } else {
        this.resetForm();
      }
    }
  }

  private populateFormWithAccountData(): void {
    if (!this.accountToEdit) return;

    this.description = this.accountToEdit.description || null;
    this.initialBalance = this.accountToEdit.balance ?? null;
    this.closingDay = this.accountToEdit.closingDay ?? null;
    this.paymentDueDay = this.accountToEdit.paymentDueDay ?? null;
    // this.selectedAccountType = this.accountToEdit.accountType || null;

    // if (this.banks && this.banks.length > 0) {
    //   this.selectedBank = this.banks.find(bank => bank.id === this.accountToEdit!.bank) || null;
    // }
  }

  private resetForm(): void {
    this.description = null;
    this.initialBalance = null;
    this.selectedBank = null;
    this.selectedAccountType = null;
    this.closingDay = null;
    this.paymentDueDay = null;
    this.bankDropdownOpen = false;
    this.accountTypeDropdownOpen = false;
  }

  onCreate(event?: Event): void {
    event?.preventDefault();

    if (!this.userId || !this.description || this.initialBalance === null || this.closingDay === null || this.paymentDueDay === null) {
      this.toastr.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const accountData: CreateAccountData & { userId: number } = {
      userId: this.userId,
      description: this.description,
      balance: this.initialBalance,
      closingDay: this.closingDay,
      paymentDueDay: this.paymentDueDay
    };

    if (this.isEditMode && this.accountToEdit?.id) {
      accountData.id = this.accountToEdit.id;
    }

    this.save.emit(accountData);
  }

  onCancel(): void {
    this.resetForm();
    this.cancel.emit();
  }

  toggleBankDropdown() {
    this.bankDropdownOpen = !this.bankDropdownOpen;
    this.accountTypeDropdownOpen = false;
  }

  selectBank(bank: Bank) {
    this.selectedBank = bank;
    this.bankDropdownOpen = false;
  }

  toggleAccountTypeDropdown() {
    this.accountTypeDropdownOpen = !this.accountTypeDropdownOpen;
    this.bankDropdownOpen = false;
  }

  selectAccountType(type: 'CHECKING' | 'SAVINGS' | 'INVESTMENTS') {
    this.selectedAccountType = type;
    this.accountTypeDropdownOpen = false;
  }
}
