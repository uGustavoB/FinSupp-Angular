import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DeleteModalComponent } from '../util/delete-modal/delete-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription, SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { AccountsService } from '../../services/accounts/accounts.service';
import { itemAnimation } from '../../animations/ItemAnimation';

@Component({
  selector: 'app-subscriptions',
  imports: [
    MatIconModule,
    CommonModule,
    MatDialogModule,
    DeleteModalComponent
  ],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css',
  animations: [itemAnimation]
})
export class SubscriptionsComponent {
  loaded: boolean = false;
  showDeleteModal: boolean = false;
  subscriptions: Subscription[] = [];
  accountDescriptions = new Map<number, string>();

  constructor(
    private subscriptionsService: SubscriptionsService,
    private accountsService: AccountsService
  ) {
    effect(() => {
      const accounts = this.accountsService.getAccountsSignal();
      this.subscriptions.forEach(sub => {
        const acc = accounts.find(a => a.id === sub.accountId);
        if (acc) {
          this.accountDescriptions.set(sub.accountId, acc.description);
        }
      });
    });

  }

  ngOnInit(): void {
    this.subscriptionsService.getSubscriptions().subscribe({
      next: (subs) => {
        this.subscriptions = subs;
        this.loadAccountsForSubscriptions(subs);
        this.loaded = true;
      },
      error: (err) => {
        this.loaded = true;
        console.error('Erro ao buscar assinaturas', err)
      }
    });
  }

  loadAccountsForSubscriptions(subs: Subscription[]) {
    subs.forEach(sub => {
      const account = this.accountsService.getAccountByIdSignal(sub.accountId);

      if (account) {
        this.accountDescriptions.set(sub.accountId, account.description);
      } else {
        this.accountDescriptions.set(sub.accountId, 'Carregando...');
        this.accountsService.fetchAccountById(sub.accountId);
      }
    });
  }


  getAccountDescription(accountId: number): string {
    return this.accountDescriptions.get(accountId) || 'Carregando...';
  }

  // Lidar com a exclusão de assinatura
  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  handleConfirm() {
    console.log('Usuário confirmou a exclusão');
    this.showDeleteModal = false;

  }

  handleCancel() {
    console.log('Usuário cancelou');
    this.showDeleteModal = false;
  }
}
