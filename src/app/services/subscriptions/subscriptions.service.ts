import { Injectable } from '@angular/core';
import { ApiService } from '../API/api.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpParams } from '@angular/common/http';

export interface Subscription {
  id: number;
  description: string;
  price: number;
  interval: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'YEARLY';
  status: 'ACTIVE' | 'INACTIVE';
  accountId: number;
}

export interface SubscriptionFilters {
  page?: number;
  size?: number;
  accountId?: number;
  description?: string;
  interval?: string;
  status?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  private apiUrl = environment.apiUrl;

  constructor(private api: ApiService) { }

  getSubscriptions(filters: SubscriptionFilters = {}): Observable<PaginatedResponse<Subscription>> {
    let params = new HttpParams();

    if (filters.page !== undefined) params = params.set('page', filters.page);
    if (filters.size !== undefined) params = params.set('size', filters.size);
    if (filters.accountId) params = params.set('accountId', filters.accountId);
    if (filters.description) params = params.set('description', filters.description);
    if (filters.interval) params = params.set('interval', filters.interval);
    if (filters.status) params = params.set('status', filters.status);

    return this.api.get<Subscription[]>(`${this.apiUrl}/subscriptions/`, params) as unknown as Observable<PaginatedResponse<Subscription>>;
  }

  createSubscription(subscription: Omit<Subscription, 'id'>): Observable<Subscription> {
    return this.api.post<Subscription>(`${this.apiUrl}/subscriptions/`, subscription);
  }

  updateSubscription(subscription: Subscription): Observable<Subscription> {
    return this.api.put<Subscription>(`${this.apiUrl}/subscriptions/${subscription.id}`, subscription);
  }

  deleteSubscription(id: number): Observable<void> {
    return this.api.delete<void>(`${this.apiUrl}/subscriptions/${id}`);
  }
}
