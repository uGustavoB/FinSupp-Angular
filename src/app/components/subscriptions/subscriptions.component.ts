import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core'; // Adicionado computed
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { DeleteModalComponent } from '../util/delete-modal/delete-modal.component';
import { CreateSubscriptionModalComponent, CreateSubscriptionData } from './create-subscription-modal/create-subscription-modal.component';
import { FilterSubscriptionModalComponent } from './filter-subscription-modal/filter-subscription-modal.component';

import { Subscription, SubscriptionsService, SubscriptionFilters } from '../../services/subscriptions/subscriptions.service';
import { AccountsService } from '../../services/accounts/accounts.service';
import { itemAnimation } from '../../animations/ItemAnimation';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    TranslateModule,
    DeleteModalComponent,
    CreateSubscriptionModalComponent,
    FilterSubscriptionModalComponent
  ],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css',
  animations: [itemAnimation]
})
export class SubscriptionsComponent implements OnInit {
  private translate = inject(TranslateService);
  private toastr = inject(ToastrService);

  private subscriptionsService = inject(SubscriptionsService);
  private accountsService = inject(AccountsService);

  loaded = false;
  subscriptions: Subscription[] = [];

  accounts = computed(() => this.accountsService.getAccountsSignal());

  // States
  showCreateModal = false;
  showFilterModal = false;
  showDeleteModal = false;

  selectedSubscription: Subscription | null = null;
  subscriptionToDeleteId: number | null = null;

  // Pagination & Filters
  filters: SubscriptionFilters = { page: 0, size: 10 };
  pagination = {
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10
  };

  constructor() {
    this.accountsService.getAccountsSignal();
  }

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.subscriptionsService.getSubscriptions(this.filters).subscribe({
      next: (response) => {
        this.subscriptions = response.data;
        if (response.pagination) {
          this.pagination = response.pagination;
        }
        this.loaded = true;
      },
      error: (err) => {
        this.loaded = true;
        this.toastr.error('Erro ao carregar assinaturas');
        console.error(err);
      }
    });
  }

  getAccountName(id: number): string {
    const acc = this.accounts().find(a => a.id === id);
    return acc ? acc.description : '...';
  }

  getIntervalLabel(interval: string): string {
    const map: any = { 'MONTHLY': 'Mensal', 'QUARTERLY': 'Trimestral', 'SEMI_ANNUAL': 'Semestral', 'YEARLY': 'Anual' };
    return map[interval] || interval;
  }

  activeFilterCount(): number {
    const { page, size, ...rest } = this.filters;
    return Object.values(rest).filter(v => v !== undefined && v !== '').length;
  }

  // --- Handlers Modais ---
  openCreateModal() {
    this.selectedSubscription = null;
    this.showCreateModal = true;
  }

  openEditModal(sub: Subscription) {
    this.selectedSubscription = sub;
    this.showCreateModal = true;
  }

  handleSaveSubscription(data: CreateSubscriptionData) {
    if (data.id) {
      this.subscriptionsService.updateSubscription(data as Subscription).subscribe({
        next: () => {
          this.toastr.success('Assinatura atualizada!');
          this.showCreateModal = false;
          this.loadSubscriptions();
        },
        error: () => this.toastr.error('Erro ao atualizar assinatura')
      });
    } else {
      this.subscriptionsService.createSubscription(data).subscribe({
        next: () => {
          this.toastr.success('Assinatura criada!');
          this.showCreateModal = false;
          this.loadSubscriptions();
        },
        error: () => this.toastr.error('Erro ao criar assinatura')
      });
    }
  }

  // --- Handlers Delete ---
  openDeleteModal(id: number) {
    this.subscriptionToDeleteId = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.subscriptionToDeleteId) {
      this.subscriptionsService.deleteSubscription(this.subscriptionToDeleteId).subscribe({
        next: () => {
          this.toastr.success('Assinatura removida!');
          this.showDeleteModal = false;
          this.loadSubscriptions();
        },
        error: () => this.toastr.error('Erro ao remover assinatura')
      });
    }
  }

  // --- Handlers Filter & Pagination ---
  applyFilters(newFilters: SubscriptionFilters) {
    this.filters = { ...newFilters, page: 0, size: 10 };
    this.showFilterModal = false;
    this.loadSubscriptions();
  }

  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.pagination.totalPages) {
      this.filters.page = newPage;
      this.loadSubscriptions();
    }
  }
}
