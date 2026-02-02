import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { fadeSlide } from '../../../animations/FadeSlide';
import { Subscription } from '../../../services/subscriptions/subscriptions.service';
import { Account } from '../../../services/accounts/accounts.service';
import { TranslateModule } from '@ngx-translate/core';

export interface CreateSubscriptionData {
  id?: number;
  description: string;
  price: number;
  interval: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'YEARLY';
  status: 'ACTIVE' | 'INACTIVE';
  accountId: number;
}

@Component({
  selector: 'app-create-subscription-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, TranslateModule],
  templateUrl: './create-subscription-modal.component.html',
  animations: [fadeSlide]
})
export class CreateSubscriptionModalComponent implements OnInit, OnChanges {
  constructor(private toastr: ToastrService) {}

  @Input() accounts: Account[] = [];
  @Input() subscriptionToEdit: Subscription | null = null;

  @Output() save = new EventEmitter<CreateSubscriptionData>();
  @Output() cancel = new EventEmitter<void>();

  description: string | null = null;
  price: number | null = null;
  selectedInterval: string | null = null;
  selectedStatus: string | null = 'ACTIVE';
  selectedAccount: Account | null = null;

  // Dropdown states
  intervalDropdownOpen = false;
  statusDropdownOpen = false;
  accountDropdownOpen = false;

  intervals = [
    { value: 'MONTHLY', label: 'Mensal' },
    { value: 'QUARTERLY', label: 'Trimestral' },
    { value: 'SEMI_ANNUAL', label: 'Semestral' },
    { value: 'YEARLY', label: 'Anual' }
  ];

  statuses = [
    { value: 'ACTIVE', label: 'Ativo' },
    { value: 'INACTIVE', label: 'Inativo' }
  ];

  get isEditMode(): boolean {
    return !!this.subscriptionToEdit;
  }

  get modalTitle(): string {
    return this.isEditMode ? 'Editar Assinatura' : 'Criar Assinatura';
  }

  get submitButtonText(): string {
    return this.isEditMode ? 'Atualizar' : 'Criar';
  }

  ngOnInit(): void {
    if (this.subscriptionToEdit) {
      this.populateForm();
    } else if (this.accounts.length > 0 && !this.selectedAccount) {
      this.selectedAccount = this.accounts[0];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['subscriptionToEdit']) {
      if (this.subscriptionToEdit) {
        this.populateForm();
      } else {
        this.resetForm();
      }
    }
  }

  populateForm() {
    if (!this.subscriptionToEdit) return;
    this.description = this.subscriptionToEdit.description;
    this.price = this.subscriptionToEdit.price;
    this.selectedInterval = this.subscriptionToEdit.interval;
    this.selectedStatus = this.subscriptionToEdit.status;
    this.selectedAccount = this.accounts.find(a => a.id === this.subscriptionToEdit?.accountId) || null;
  }

  resetForm() {
    this.description = null;
    this.price = null;
    this.selectedInterval = 'MONTHLY';
    this.selectedStatus = 'ACTIVE';
    this.selectedAccount = this.accounts.length > 0 ? this.accounts[0] : null;
  }

  onSubmit(event?: Event) {
    event?.preventDefault();

    if (!this.description || this.price === null || !this.selectedInterval || !this.selectedStatus || !this.selectedAccount) {
      this.toastr.error('Por favor, preencha todos os campos.');
      return;
    }

    const data: CreateSubscriptionData = {
      description: this.description,
      price: this.price,
      interval: this.selectedInterval as any,
      status: this.selectedStatus as any,
      accountId: this.selectedAccount.id
    };

    if (this.isEditMode && this.subscriptionToEdit) {
      data.id = this.subscriptionToEdit.id;
    }

    this.save.emit(data);
  }

  onCancel() {
    this.resetForm();
    this.cancel.emit();
  }

  // Dropdown Toggles
  toggleIntervalDropdown() { this.intervalDropdownOpen = !this.intervalDropdownOpen; this.statusDropdownOpen = false; this.accountDropdownOpen = false; }
  toggleStatusDropdown() { this.statusDropdownOpen = !this.statusDropdownOpen; this.intervalDropdownOpen = false; this.accountDropdownOpen = false; }
  toggleAccountDropdown() { this.accountDropdownOpen = !this.accountDropdownOpen; this.intervalDropdownOpen = false; this.statusDropdownOpen = false; }

  // Selections
  selectInterval(val: string) { this.selectedInterval = val; this.intervalDropdownOpen = false; }
  selectStatus(val: string) { this.selectedStatus = val; this.statusDropdownOpen = false; }
  selectAccount(acc: Account) { this.selectedAccount = acc; this.accountDropdownOpen = false; }

  getLabel(list: any[], value: string | null) {
    return list.find(i => i.value === value)?.label || 'Selecione';
  }
}
