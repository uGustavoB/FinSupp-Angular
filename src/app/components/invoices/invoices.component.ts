import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Invoice, InvoicesService } from '../../services/invoices/invoices.service';

@Component({
  selector: 'app-invoices',
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css'
})
export class InvoicesComponent implements OnInit {
  constructor(private invoiceService: InvoicesService) {}

  invoices!: Signal<Invoice[]>;

  ngOnInit() {
    this.setOpenTab('OPEN');

    this.invoiceService.getInvoices().subscribe();

    this.invoices = this.invoiceService.filteredInvoices;
  }

  openTab: 'OPEN' | 'PAID' | 'OVERDUE' | 'ALL' = 'OPEN';

  setOpenTab(tab: 'OPEN' | 'PAID' | 'OVERDUE' | 'ALL') {
    this.openTab = tab;
    
    this.invoiceService.setFilter(tab);
  }
}
