import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { itemAnimation } from '../../../animations/ItemAnimation';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  animations: [itemAnimation]
})
export class SidebarComponent {
  private translate = inject(TranslateService);

  links = [
    {
      name: 'sidebar.dashboard',
      icon: 'home',
      route: '/dashboard'
    },
    {
      name: 'sidebar.accounts',
      icon: 'wallet',
      route: '/accounts'
    },
    {
      name: 'sidebar.categories',
      icon: 'style',
      route: '/categories'
    },
    {
      name: 'sidebar.transactions',
      icon: 'swap_horiz',
      route: '/transactions'
    },
    {
      name: 'sidebar.subscriptions',
      icon: 'autorenew',
      route: '/subscriptions'
    },
    {
      name: 'sidebar.invoices',
      icon: 'receipt_long',
      route: '/invoices'
    },
    {
      name: 'sidebar.profile',
      icon: 'person',
      route: '/profile'
    }
  ];

  loaded = false;
  navBarOpen = false;
  screenWidth = window.innerWidth;

  @ViewChild('sidebarRef') sidebar!: ElementRef;
  @ViewChild('sidebarButtonRef') sidebarButton!: ElementRef;

  ngOnInit() {
    setTimeout(() => {
      this.loaded = true;
    }, 50);
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.screenWidth = window.innerWidth;
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (this.screenWidth >= 768) {
      this.navBarOpen = true;
    } else {
      this.navBarOpen = false;
    }
  }

  constructor(private Router: Router) {}

  redirectTo(route: string) {
    this.Router.navigate([route]);
  }

  logout() {
    localStorage.removeItem('token');
    this.Router.navigate(['/auth']);
  }

  openSidebar() {
    this.navBarOpen = true;
    this.sidebar.nativeElement.classList.remove('hidden');
    this.sidebar.nativeElement.classList.add('absolute', 'z-50');
    this.sidebarButton.nativeElement.classList.add('hidden');
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.screenWidth < 768) {
      const clickedInsideSidebar = this.sidebar.nativeElement.contains(event.target);
      const clickedOnButton = this.sidebarButton.nativeElement.contains(event.target);

      if (this.navBarOpen && !clickedInsideSidebar && !clickedOnButton) {
        this.navBarOpen = false;
        this.sidebar.nativeElement.classList.add('hidden');
        this.sidebar.nativeElement.classList.remove('absolute', 'z-50');
        this.sidebarButton.nativeElement.classList.remove('hidden');
      }
    }
  }
}
