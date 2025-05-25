import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  links = [
    {
      name: 'Dashboard',
      icon: 'home',
      route: '/dashboard'
    },
    {
      name: 'Contas',
      icon: 'wallet',
      route: '/accounts'
    },
    {
      name: 'Categorias',
      icon: 'style',
      route: '/categories'
    },
    {
      name: 'Transações',
      icon: 'swap_horiz',
      route: '/transactions'
    },
    {
      name: 'Assinaturaes',
      icon: 'autorenew',
      route: '/subscriptions'
    },
    {
      name: 'Faturas',
      icon: 'receipt_long',
      route: '/bills'
    },
    {
      name: 'Perfil',
      icon: 'person',
      route: '/profile'
    }
  ]
}
