import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { User, UsersService } from '../../../services/users/users.service';
import { Observable } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    TranslateModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  private translate = inject(TranslateService);

  constructor(private userService: UsersService, private Router: Router) { }

  user = {} as User;
  user_inicial = 'A ';

  theme = localStorage.getItem("theme") || 'dark';

  ngOnInit() {
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    const user: Observable<User> = this.userService.getUser();
    user.subscribe({
      next: (data) => {
        this.user = data;
        this.user_inicial = data.name.charAt(0).toUpperCase();
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      }
    });

    const lang = localStorage.getItem('language') || 'pt';
    this.translate.use(lang);
  }

  @ViewChild('menuRef') menuRef!: ElementRef;
  themeMenuOpen = false;

  @ViewChild('langMenuRef') langMenuRef!: ElementRef;
  langMenuOpen = false;

  @ViewChild('profileMenuRef') profileMenuRef!: ElementRef;
  profileMenuOpen = false;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.menuRef.nativeElement.contains(event.target) &&
        !this.langMenuRef.nativeElement.contains(event.target) &&
        !this.profileMenuRef.nativeElement.contains(event.target)) {
      this.themeMenuOpen = false;
      this.langMenuOpen = false;
      this.profileMenuOpen = false;
    }
  }

  toggleMenu() {
    this.themeMenuOpen = !this.themeMenuOpen;
    this.langMenuOpen = false;
    this.profileMenuOpen = false;
  }

  toggleLangMenu() {
    this.langMenuOpen = !this.langMenuOpen;
    this.themeMenuOpen = false;
    this.profileMenuOpen = false;
  }

  toggleProfileMenu() {
    console.log(this.profileMenuOpen);
    this.profileMenuOpen = !this.profileMenuOpen;
    this.themeMenuOpen = false;
    this.langMenuOpen = false;

    console.log(this.profileMenuOpen);
  }

  setLanguage(lang: 'pt' | 'en') {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
    this.langMenuOpen = false;
  }

  setTheme(mode: 'light' | 'dark') {
    this.themeMenuOpen = false;
    switch (mode) {
      case 'light':
      document.documentElement.classList.remove('dark');
      this.theme = 'light';
      localStorage.setItem('theme', 'light');
      break;
      case 'dark':
      document.documentElement.classList.add('dark');
      this.theme = 'dark';
      localStorage.setItem('theme', 'dark');
      break;
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.Router.navigate(['/auth']);
  }

  goToProfile() {
    this.Router.navigate(['/profile']);
    this.profileMenuOpen = false;
  }
}
