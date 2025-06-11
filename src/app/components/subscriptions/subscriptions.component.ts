import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DeleteModalComponent } from '../util/delete-modal/delete-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

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

  constructor(private dialog: MatDialog) { }

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

  subscriptions = [
    {
      "id": 67,
      "description": "Spotify",
      "price": 12,
      "interval": "YEARLY",
      "status": "ACTIVE",
      "accountId": 100
    },
    {
      "id": 133,
      "description": "teste",
      "price": 1,
      "interval": "MONTHLY",
      "status": "INACTIVE",
      "accountId": 100
    },
    {
      "id": 68,
      "description": "Youtube Member",
      "price": 13,
      "interval": "SEMI_ANNUAL",
      "status": "ACTIVE",
      "accountId": 100
    },
    {
      "id": 166,
      "description": "Youtube Premium",
      "price": 16.9,
      "interval": "QUARTERLY",
      "status": "ACTIVE",
      "accountId": 100
    }
  ];


}
