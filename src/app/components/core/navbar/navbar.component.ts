import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  user_inicial = 'A';

  theme = localStorage.getItem("theme") || 'light';

  @ViewChild('menuRef') menuRef!: ElementRef;
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
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

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.menuRef.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }
}
