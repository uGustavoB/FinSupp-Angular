import { Component, inject } from '@angular/core';
import { ProfileService, UserProfile } from '../../services/profile/profile.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  imports: [
    TranslateModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  private translate = inject(TranslateService);

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
