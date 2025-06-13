import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ApiService } from '../API/api.service';

export interface Account {
  id: number;
  description: string;
  bank: string;
  accountType: string;
  balance: number;
  closingDay: number;
  paymentDueDay: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private apiUrl = environment.apiUrl;

  constructor(private api: ApiService) { }

  getAccounts(): Observable<Account[]> {
    return this.api.get<Account[]>(`${this.apiUrl}/accounts/`);
  }

}
