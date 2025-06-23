import { Injectable } from '@angular/core';
import { ApiService } from '../API/api.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

// "id": "123e4567-e89b-12d3-a456-426614174000",
//     "name": "João Silva",
//     "email": "joao.silva@example.com"

export interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = environment.apiUrl;

  constructor(private api: ApiService) { }

  getUser(): Observable<User> {
    return this.api.get<User>(`${this.apiUrl}/users/me/`);
  }
}
