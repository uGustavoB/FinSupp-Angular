import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { User, UsersService } from '../../../services/users/users.service';
import { Observable } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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

  constructor(private userService: UsersService) { }

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
        this.user_inicial = data.name.charAt(0).toUpperCase() + ' ';
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      }
    });

    const lang = localStorage.getItem('language') || 'pt';
    this.translate.use(lang);
  }

  @ViewChild('menuRef') menuRef!: ElementRef;
  menuOpen = false;

  @ViewChild('langMenuRef') langMenuRef!: ElementRef;
  langMenuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.langMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.menuRef.nativeElement.contains(event.target) &&
        !this.langMenuRef.nativeElement.contains(event.target)) {
      this.menuOpen = false;
      this.langMenuOpen = false;
    }
  }

  setTheme(mode: 'light' | 'dark') {
    this.menuOpen = false;
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

  toggleLangMenu() {
    this.langMenuOpen = !this.langMenuOpen;
    this.menuOpen = false; // fecha o menu de tema se estiver aberto
  }

  setLanguage(lang: 'pt' | 'en') {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
    this.langMenuOpen = false;
  }
}
