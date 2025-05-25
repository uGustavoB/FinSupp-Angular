import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-default-login-layout',
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule
  ],
  templateUrl: './default-login-layout.component.html',
  styleUrl: './default-login-layout.component.css',
})
export class DefaultLoginLayoutComponent {
  activeTab: 'login' | 'register' = 'login';

  benefits = [
    {
      title: 'Rastreie suas despesas',
      description: 'Monitore todas as suas transações em um só lugar.',
    },
    {
      title: 'Gerencie várias contas bancárias',
      description: 'Acompanhe todas as suas contas bancárias.',
    },
    {
      title: 'Gestão de faturas',
      description: 'Nunca perca um pagamento com nosso sistema de rastreamento de faturas.',
    },
    {
      title: 'Rastreamento de assinaturas',
      description: 'Fique de olho em suas despesas recorrentes.',
    }
  ];

  switchForm(activeTab: 'login' | 'register') {
    this.activeTab = activeTab;
  }
}
