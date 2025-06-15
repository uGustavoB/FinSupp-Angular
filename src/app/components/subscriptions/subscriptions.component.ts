import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DeleteModalComponent } from '../util/delete-modal/delete-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription, SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { AccountsService } from '../../services/accounts/accounts.service';
import { itemAnimation } from '../../animations/ItemAnimation';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css',
  animations: [itemAnimation]
})
export class SubscriptionsComponent {
  loaded: boolean = false;
  subscriptions: Subscription[] = [];
  accountDescriptions = new Map<number, string>();

  constructor(
    private subscriptionsService: SubscriptionsService,
    private accountsService: AccountsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.subscriptionsService.getSubscriptions().subscribe({
      next: (subs) => {
        this.subscriptions = subs;
        this.loadAccountsForSubscriptions(subs);
        this.loaded = true;
      },
      error: (err) => console.error('Erro ao buscar assinaturas', err)
    });
  }

  loadAccountsForSubscriptions(subs: Subscription[]) {
    subs.forEach(sub => {
      const accId = sub.accountId;
      if (!this.accountDescriptions.has(accId)) {
        this.accountsService.getAccountById(accId).subscribe({
          next: (acc) => this.accountDescriptions.set(accId, acc.description),
          error: (err) => console.warn(`Erro ao carregar conta ${accId}`, err)
        });
      }
    });
  }

  getAccountDescription(accountId: number): string {
    console.log(this.accountDescriptions.get(accountId));
    return this.accountDescriptions.get(accountId) || 'Carregando...';
  }

  openDeleteModal(): void {
    this.dialog.open(DeleteModalComponent, {
      data: { name: "assinatura" },
      backdropClass: 'blurred-backdrop'
    });
  }
}
