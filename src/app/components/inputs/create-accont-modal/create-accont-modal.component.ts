import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { fadeSlide } from '../../../animations/FadeSlide';
import { Bank } from '../../../services/accounts/accounts.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

export interface CreateAccountData {
  description: string;
  accountType: 'CHECKING' | 'SAVINGS' | 'INVESTMENTS';
  bank: number;
  balance: number;
  closingDay: number;
  paymentDueDay: number;
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
export class CreateAccountModalComponent {
  constructor(private toastr: ToastrService) {}

  bankDropdownOpen = false;
  accountTypeDropdownOpen = false;

  description: string | null = null;
  initialBalance: number | null = null;
  selectedBank: Bank | null = null;
  selectedAccountType: 'CHECKING' | 'SAVINGS' | 'INVESTMENTS' | null = null;
  closingDay: number | null = null;
  paymentDueDay: number | null = null;

  @Input() banks: Bank[] = [];
  @Input() accountTypes: any[] = [];

  @Output() create = new EventEmitter<CreateAccountData>();
  @Output() cancel = new EventEmitter<void>();

  onCreate(event?: Event): void {
    event?.preventDefault();

    if (!this.description || !this.selectedBank || !this.selectedAccountType || this.initialBalance === null || this.closingDay === null || this.paymentDueDay === null) {
      this.toastr.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (this.closingDay < 1 || this.closingDay > 31) {
      this.toastr.error('O dia de fechamento deve ser entre 1 e 31.');
      return;
    }
    if (this.paymentDueDay < 1 || this.paymentDueDay > 31) {
      this.toastr.error('O dia de vencimento deve ser entre 1 e 31.');
      return;
    }

    const accountData: CreateAccountData = {
      description: this.description,
      accountType: this.selectedAccountType,
      bank: this.selectedBank?.id,
      balance: this.initialBalance,
      closingDay: this.closingDay,
      paymentDueDay: this.paymentDueDay
    };

    this.create.emit(accountData);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  toggleBankDropdown() {
    this.bankDropdownOpen = !this.bankDropdownOpen;
  }

  selectBank(bank: Bank) {
    this.selectedBank = bank;
    this.bankDropdownOpen = false;
  }

  toggleAccountTypeDropdown() {
    this.accountTypeDropdownOpen = !this.accountTypeDropdownOpen;
  }

  selectAccountType(type: 'CHECKING' | 'SAVINGS' | 'INVESTMENTS') {
    this.selectedAccountType = type;
    this.accountTypeDropdownOpen = false;
  }
}
