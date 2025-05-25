import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-default-login-layout',
  imports: [CommonModule],
  templateUrl: './default-login-layout.component.html',
  styleUrl: './default-login-layout.component.css',
})
export class DefaultLoginLayoutComponent {
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
}
