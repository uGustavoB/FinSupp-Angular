import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginService } from '../../services/auth/login/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-default-login-layout',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule
  ],
  templateUrl: './default-login-layout.component.html',
  styleUrls: ['./default-login-layout.component.css']
})
export class DefaultLoginLayoutComponent implements OnInit {
  theme = localStorage.getItem("theme") || 'dark';
  activeTab: 'login' | 'register' = 'login';

  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

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

  constructor(private loginService: LoginService, private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    if (this.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }

  switchForm(tab: 'login' | 'register') {
    this.activeTab = tab;
  }

  onSubmit(): void {
    if (this.activeTab === 'login') {
      if (!this.email || !this.password) {
        this.toastr.warning('Por favor, preencha todos os campos de login.');
        return;
      }

      this.loginService.login(this.email, this.password).subscribe({
        next: (response) => {
          this.toastr.success('Login realizado com sucesso!');
          this.router.navigate(['/accounts']);
        },
        error: (err) => {
          console.error('Erro no login:', err);
          this.toastr.error('Erro ao fazer login. Verifique as credenciais.');
        }
      });
    } else if (this.activeTab === 'register') {
      console.log('Registrando usuário:', this.email, this.password, this.confirmPassword);
    }
  }
}
