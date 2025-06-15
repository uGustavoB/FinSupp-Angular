import { Component } from '@angular/core';
import { ProfileService, UserProfile } from '../../services/profile/profile.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profile: UserProfile = {
    id: '',
    name: '',
    email: ''
  }

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
      },
      error: (err) => console.error('Erro ao carregar perfil', err)
    });
  }
}
