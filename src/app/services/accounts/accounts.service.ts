import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  constructor(private http: HttpClient) { }

  getAccounts(): Observable<Account[]> {
  return this.http.get<{ dataList: Account[] }>(`${this.apiUrl}/accounts/`)
    .pipe(
      map(response => response.dataList)
    );
}
}
