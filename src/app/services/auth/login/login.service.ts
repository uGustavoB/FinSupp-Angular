import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

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

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.apiUrl}`, { email, password }).pipe(
      tap(response => {
        // Handle successful login response
        console.log('Login successful:', response);
      }, error => {
        // Handle login error
        console.error('Login failed:', error);
      })
    );
  }
}

