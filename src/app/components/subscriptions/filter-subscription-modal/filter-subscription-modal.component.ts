import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { fadeSlide } from '../../../animations/FadeSlide';
import { SubscriptionFilters } from '../../../services/subscriptions/subscriptions.service';
import { Account } from '../../../services/accounts/accounts.service';

@Component({
  selector: 'app-filter-subscription-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './filter-subscription-modal.component.html',
  animations: [fadeSlide]
})
export class FilterSubscriptionModalComponent {
  @Input() accounts: Account[] = [];
  @Input() currentFilters: SubscriptionFilters = {};

  @Output() apply = new EventEmitter<SubscriptionFilters>();
  @Output() cancel = new EventEmitter<void>();

  filters: SubscriptionFilters = {};

  // Dropdown states
  intervalDropdownOpen = false;
  statusDropdownOpen = false;
  accountDropdownOpen = false;

  intervals = [
    { value: '', label: 'Todos' },
    { value: 'MONTHLY', label: 'Mensal' },
    { value: 'QUARTERLY', label: 'Trimestral' },
    { value: 'SEMI_ANNUAL', label: 'Semestral' },
    { value: 'YEARLY', label: 'Anual' }
  ];

  statuses = [
    { value: '', label: 'Todos' },
    { value: 'ACTIVE', label: 'Ativo' },
    { value: 'INACTIVE', label: 'Inativo' }
  ];

  ngOnInit() {
    this.filters = { ...this.currentFilters };
  }

  onApply() {
    this.apply.emit(this.filters);
  }

  onClear() {
    this.filters = {};
    this.apply.emit({});
  }

  getAccountLabel(id?: number) {
    if (!id) return 'Todas';
    return this.accounts.find(a => a.id === id)?.description || 'Todas';
  }

  getLabel(list: any[], value?: string) {
    return list.find(i => i.value === (value || ''))?.label || 'Todos';
  }
}
