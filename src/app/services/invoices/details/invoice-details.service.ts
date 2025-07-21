import { Injectable } from '@angular/core';
import { ApiService } from '../../API/api.service';
import { environment } from '../../../../environments/environment';
import { map, Observable, of, tap } from 'rxjs';

export interface InvoiceItem {
  id: number;
  description: string;
  amount: number;
  installmentNumber: number;
  billId: number;
  transactionId: number | null;
  subscriptionId: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceDetailsService {

  private apiUrl = environment.apiUrl;

  constructor(private api: ApiService) { }

  getCategoryById(id: number): Observable<InvoiceItem[]> {
    return this.api.get<InvoiceItem[]>(`${this.apiUrl}/bills/${id}/items?page=0&size=50`).pipe(
      map(invoiceItems => invoiceItems.data)
    );
  }
}
