import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from '../API/api.service';
import { Observable, tap } from 'rxjs';

export type InvoiceStatus = 'OPEN' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface Invoice {
  id: number;
  status: InvoiceStatus;
  totalAmount: number;
  accountId: number;
  startDate: string;
  endDate: string;
  dueDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {
  private invoices = signal<Invoice[]>([]);
  private filter = signal<InvoiceStatus | 'ALL'>('ALL');
  private apiUrl = environment.apiUrl;
  private invoiceCache = new Map<number, Invoice>();

  constructor(private api: ApiService) { }

  getInvoices(): Observable<Invoice[]> {
    return this.api.get<Invoice[]>(`${this.apiUrl}/bills/`).pipe(
      tap(invoices => {
        console.log('Invoices fetched:', invoices);
        this.invoices.set(invoices);
        invoices.forEach(inv => this.invoiceCache.set(inv.id, inv));
      })
    );
  }

  getInvoiceById(id: number): Observable<Invoice> {
    const cached = this.invoiceCache.get(id);
    if (cached) {
      return new Observable<Invoice>(subscriber => {
        subscriber.next(cached);
        subscriber.complete();
      });
    }

    return this.api.get<Invoice>(`${this.apiUrl}/invoices/${id}`).pipe(
      tap(invoice => {
        this.invoiceCache.set(id, invoice);
        const current = this.invoices();
        const index = current.findIndex(inv => inv.id === id);
        if (index !== -1) {
          current[index] = invoice;
          this.invoices.set([...current]);
        } else {
          this.invoices.set([...current, invoice]);
        }
      })
    );
  }

  setFilter(status: InvoiceStatus | 'ALL') {
    this.filter.set(status);
  }

  readonly filteredInvoices = computed(() => {
    const all = this.invoices();
    const filter = this.filter();
    return filter === 'ALL' ? all : all.filter(i => i.status === filter);
  });
}
