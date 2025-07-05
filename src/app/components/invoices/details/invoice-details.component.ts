import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fadeSlide } from '../../../animations/FadeSlide';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Invoice } from '../../../services/invoices/invoices.service';

@Component({
  selector: 'app-invoice-details',
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.css',
  animations: [fadeSlide]
})
export class InvoiceDetailsComponent {
  invoiceItens = [
    {
      "id": 67,
      "description": "Spotify Subscription",
      "amount": 12,
      "installmentNumber": 1,
      "billId": 67,
      "transactionId": null,
      "subscriptionId": 67
    },
    {
      "id": 79,
      "description": "Youtube Member Subscription",
      "amount": 13,
      "installmentNumber": 1,
      "billId": 67,
      "transactionId": null,
      "subscriptionId": 68
    },
    {
      "id": 88,
      "description": "Real Debrid",
      "amount": 32.115,
      "installmentNumber": 1,
      "billId": 67,
      "transactionId": 69,
      "subscriptionId": null
    },
    {
      "id": 92,
      "description": "Oculos",
      "amount": 55,
      "installmentNumber": 1,
      "billId": 67,
      "transactionId": 71,
      "subscriptionId": null
    },
    {
      "id": 133,
      "description": "Presente Bianca",
      "amount": 264.96,
      "installmentNumber": 1,
      "billId": 67,
      "transactionId": 68,
      "subscriptionId": null
    },
    {
      "id": 135,
      "description": "Monitor Gamer",
      "amount": 223.85,
      "installmentNumber": 1,
      "billId": 67,
      "transactionId": 70,
      "subscriptionId": null
    },
    {
      "id": 137,
      "description": "Hidratante Mãe",
      "amount": 41,
      "installmentNumber": 1,
      "billId": 67,
      "transactionId": 67,
      "subscriptionId": null
    },
    {
      "id": 138,
      "description": "Crédito Celular",
      "amount": 25,
      "installmentNumber": 1,
      "billId": 67,
      "transactionId": 72,
      "subscriptionId": null
    }
  ];

  @Input() invoice: Invoice | null = null;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  get transactionCount(): {length: number, total: number} {
    const transactions = this.invoiceItens.filter(item => item.transactionId !== null);
    const total = transactions.reduce((sum, item) => sum + item.amount, 0);
    return { length: transactions.length, total };
  }

  get subscriptionCount(): {length: number, total: number} {
    const subscriptions = this.invoiceItens.filter(item => item.transactionId === null);
    const total = subscriptions.reduce((sum, item) => sum + item.amount, 0);
    return { length: subscriptions.length, total };
  }

}
