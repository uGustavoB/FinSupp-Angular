import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { tap, catchError, throwError } from 'rxjs';
import { ApiService } from '../../API/api.service';

interface LoginResponse {
  message: string;
  type: string;
  data: {
    name: string;
    token: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = `${environment.apiUrl}/auth/login`;

  constructor(private api: ApiService) {}

  login(email: string, password: string) {
    return this.api.post<LoginResponse>(this.apiUrl, { email, password }).pipe(
      tap(response => {
        console.log('Login successful:', response);
        const token = response.data?.token;
        if (token) {
          localStorage.setItem('token', token);
        }
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }
}
