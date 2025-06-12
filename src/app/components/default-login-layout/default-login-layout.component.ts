import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../services/auth/login/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-default-login-layout',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule
  ],
  templateUrl: './default-login-layout.component.html',
  styleUrl: './default-login-layout.component.css',
})
export class DefaultLoginLayoutComponent {
  theme = localStorage.getItem("theme") || 'dark';

  ngOnInit() {
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }

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

  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private loginService: LoginService, private router: Router) { }

  onSubmit(): void {
    if (this.activeTab === 'login') {
      if (!this.email || !this.password) {
        alert('Please enter both email and password.');
        return;
      }

      this.loginService.login(this.email, this.password).subscribe({
        next: (response) => {
          localStorage.setItem('token', response?.data?.token);
          this.router.navigate(['/accounts']);
        },
        error: (error) => {
          console.error('Login error:', error);
        }
      });
    } else if (this.activeTab === 'register') {
      // Handle registration logic here
      console.log('Registering user:', this.email, this.password, this.confirmPassword);
      // You can call a registration service here
    }
  }
}
