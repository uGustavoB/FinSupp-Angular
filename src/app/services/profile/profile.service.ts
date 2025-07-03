import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from '../API/api.service';
import { map, Observable } from 'rxjs';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = environment.apiUrl;

  constructor(private api: ApiService) { }

  getProfile(): Observable<UserProfile> {
    return this.api.get<UserProfile>(`${this.apiUrl}/users/me/`).pipe(
      map(res => res.data)
    );
  }
}
