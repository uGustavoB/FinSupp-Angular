import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Invoice, InvoicesService } from '../../services/invoices/invoices.service';
import { ToastrService } from 'ngx-toastr';
import { InvoiceDetailsComponent } from './details/invoice-details.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-invoices',
  imports: [
    CommonModule,
    MatIconModule,
    InvoiceDetailsComponent,
    TranslateModule
  ],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css'
})
export class InvoicesComponent implements OnInit {
  private translate = inject(TranslateService);

  showDetailsModal: boolean = false;
  selectedInvoice!: Invoice;

  constructor(private invoiceService: InvoicesService, private toastr: ToastrService) {}

  invoices!: Signal<Invoice[]>;

  ngOnInit() {
    this.setOpenTab('OPEN');

    this.invoiceService.getInvoices().subscribe({
      error: (err) => {
        this.toastr.error('Erro ao buscar faturas');
        console.error('Erro ao buscar faturas', err);
      }
    });

    this.invoices = this.invoiceService.filteredInvoices;
  }

  openTab: 'OPEN' | 'CLOSED' | 'PAID' | 'OVERDUE' | 'ALL' = 'OPEN';

  setOpenTab(tab: 'OPEN' | 'CLOSED' | 'PAID' | 'OVERDUE' | 'ALL') {
    this.openTab = tab;

    this.invoiceService.setFilter(tab);
  }

  openDetailsModal(invoice: Invoice): void {
    this.selectedInvoice = invoice;
    this.showDetailsModal = true;
  }

  handleDetailsModalConfirm(): void {
    this.showDetailsModal = false;
  }

  handleDetailsModalCancel(): void {
    this.showDetailsModal = false;
  }
}
