import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { fadeSlide } from '../../../animations/FadeSlide';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Invoice } from '../../../services/invoices/invoices.service';
import { InvoiceDetailsService, InvoiceItem } from '../../../services/invoices/details/invoice-details.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-invoice-details',
  standalone: true, // Garante que é standalone conforme seu padrão
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.css',
  animations: [fadeSlide]
})
export class InvoiceDetailsComponent implements OnInit {
  private invoiceDetailsService = inject(InvoiceDetailsService);
  private translate = inject(TranslateService);

  @Input() invoice: Invoice | null = null;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  loaded: boolean = false;

  transactions: InvoiceItem[] = [];
  subscriptions: InvoiceItem[] = [];

  totalTransactions = 0;
  totalSubscriptions = 0;

  ngOnInit(): void {
    if (!this.invoice) return;

    this.invoiceDetailsService.getCategoryById(this.invoice.id).subscribe({
      next: (data) => {
        this.transactions = data.filter(item => item.transactionId !== null);
        this.subscriptions = data.filter(item => item.transactionId === null && item.subscriptionId !== null);

        this.totalTransactions = this.transactions.reduce((acc, item) => acc + item.amount, 0);
        this.totalSubscriptions = this.subscriptions.reduce((acc, item) => acc + item.amount, 0);

        this.loaded = true;
      },
      error: (err) => {
        this.loaded = true;
        this.translate.get('invoiceDetails.notifications.errorFetchingItems').subscribe((message: string) => {
          console.error(message, err);
        });
      }
    });
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
