import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DeleteModalComponent } from '../util/delete-modal/delete-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription, SubscriptionsService } from '../../services/subscriptions/subscriptions.service';

@Component({
  selector: 'app-subscriptions',
  imports: [
    MatIconModule,
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css'
})
export class SubscriptionsComponent {
  subscriptions: Subscription[] = [];

  constructor(
    private accountsService: SubscriptionsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.accountsService.getSubscriptions().subscribe({
      next: (data) => this.subscriptions = data,
      error: (err) => console.error('Erro ao buscar assinaturas', err)
    });
  }

  openDeleteModal(): void {
    this.dialog.open(DeleteModalComponent,
      {
        data: {
          name: "assinatura"
        },
        backdropClass: 'blurred-backdrop'
      }
    );
  }
}
