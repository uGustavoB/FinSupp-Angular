import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

interface ApiResponse<T> {
  message: string;
  type: string;
  email?: string;
  token?: string;
  data?: T;
  dataList?: T[];
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<ApiResponse<T>>(url, { params }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        console.log(response.type === 'Success'
          ? `GET: ${response.message}`
          : `GET failed: ${response.message}`);
      }),
      map(response => response.data as T), // 🔧 Aqui transforma o tipo corretamente
      catchError(error => {
        console.error('GET error:', error);
        return throwError(() => error);
      })
    );
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<ApiResponse<T>>(url, body).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        console.log(response.type === 'Success'
          ? `POST: ${response.message}`
          : `POST failed: ${response.message}`);
      }),
      map(response => response.data as T),
      catchError(error => {
        console.error('POST error:', error);
        return throwError(() => error);
      })
    );
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<ApiResponse<T>>(url, body).pipe(
      tap(response => {
        console.log(response.type === 'Success'
          ? `PUT: ${response.message}`
          : `PUT failed: ${response.message}`);
      }),
      map(response => response.data as T),
      catchError(error => {
        console.error('PUT error:', error);
        return throwError(() => error);
      })
    );
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(url).pipe(
      tap(response => {
        console.log(response.type === 'Success'
          ? `DELETE: ${response.message}`
          : `DELETE failed: ${response.message}`);
      }),
      map(response => response.data as T),
      catchError(error => {
        console.error('DELETE error:', error);
        return throwError(() => error);
      })
    );
  }
}
