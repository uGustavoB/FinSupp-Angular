import { Injectable } from '@angular/core';
import { ApiService } from '../API/api.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Subscription {
  id: number;
  description: string;
  price: number;
  interval: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'YEARLY';
  status: 'ACTIVE' | 'INACTIVE';
  accountId: number;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  private apiUrl = environment.apiUrl;

  constructor(private api: ApiService) { }

  getSubscriptions(): Observable<Subscription[]> {
    return this.api.get<Subscription[]>(`${this.apiUrl}/subscriptions/`);
  }
}
