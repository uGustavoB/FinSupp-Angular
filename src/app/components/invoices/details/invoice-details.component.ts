import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { fadeSlide } from '../../../animations/FadeSlide';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Invoice } from '../../../services/invoices/invoices.service';
import { InvoiceDetailsService, InvoiceItem } from '../../../services/invoices/details/invoice-details.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-invoice-details',
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.css',
  animations: [fadeSlide]
})
export class InvoiceDetailsComponent implements OnInit{
  constructor(private invoiceDetailsService: InvoiceDetailsService) { }

  private translate = inject(TranslateService);

  invoiceItens: InvoiceItem[] = [];

  loaded: boolean = false;

  @Input() invoice: Invoice | null = null;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  ngOnInit(): void {
    this.invoiceDetailsService.getCategoryById(this.invoice?.id || 0).subscribe({
      next: (data) => {
        this.invoiceItens = data;
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
