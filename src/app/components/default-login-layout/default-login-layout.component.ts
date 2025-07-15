import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginService } from '../../services/auth/login/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-default-login-layout',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    TranslateModule
  ],
  templateUrl: './default-login-layout.component.html',
  styleUrls: ['./default-login-layout.component.css']
})
export class DefaultLoginLayoutComponent implements OnInit {
  private translate = inject(TranslateService);

  theme = localStorage.getItem("theme") || 'dark';
  activeTab: 'login' | 'register' = 'login';

  name: string = '';
  email: string = '';
  password: string = '';

  benefits = [
    {
      title: 'login.benefits.trackExpenses.title',
      description: 'login.benefits.trackExpenses.description',
    },
    {
      title: 'login.benefits.manageBankAccounts.title',
      description: 'login.benefits.manageBankAccounts.description',
    },
    {
      title: 'login.benefits.invoiceManagement.title',
      description: 'login.benefits.invoiceManagement.description',
    },
    {
      title: 'login.benefits.subscriptionTracking.title',
      description: 'login.benefits.subscriptionTracking.description',
    }
  ];

  get activeTabWelcomeKey(): string {
    return this.activeTab === 'login'
      ? 'login.activeTab.login.welcome'
      : 'login.activeTab.register.welcome';
  }

  get activeTabDescriptionKey(): string {
    return this.activeTab === 'login'
      ? 'login.activeTab.login.description'
      : 'login.activeTab.register.description';
  }

  get namePlaceholder(): string {
    return this.activeTab === 'login'
      ? 'login.inputs.name.placeholder'
      : 'login.inputs.name.placeholder';
  }

  get emailPlaceholder(): string {
    return this.activeTab === 'login'
      ? 'login.inputs.email.placeholder'
      : 'login.inputs.email.placeholder';
  }

  get passwordPlaceholder(): string {
    return this.activeTab === 'login'
      ? 'login.inputs.password.placeholder'
      : 'login.inputs.password.placeholder';
  }

  get nameLabel(): string {
    return this.activeTab === 'login'
      ? 'login.inputs.name.title'
      : 'login.inputs.name.title';
  }

  get emailLabel(): string {
    return this.activeTab === 'login'
      ? 'login.inputs.email.title'
      : 'login.inputs.email.title';
  }

  get passwordLabel(): string {
    return this.activeTab === 'login'
      ? 'login.inputs.password.title'
      : 'login.inputs.password.title';
  }

  constructor(private loginService: LoginService, private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    const lang = localStorage.getItem('language') || 'pt';
    this.translate.use(lang);

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

      this.login(this.email, this.password);
    } else if (this.activeTab === 'register') {
      if (!this.name || !this.email || !this.password) {
        this.toastr.warning('Por favor, preencha todos os campos de registro.');
        return;
      }

      this.register(this.name, this.email, this.password);
    }
  }

  login(email: string, password: string): void {
    this.loginService.login(email, password).subscribe({
      next: (response) => {
        this.translate.get('login.notifications.loginSuccess').subscribe((message: string) => {
          this.toastr.success(message);
        });
        this.router.navigate(['/accounts']);
      },
      error: (err) => {
        console.error('Erro no login:', err);
        this.translate.get('login.notifications.loginFail').subscribe((message: string) => {
          this.toastr.error(message);
        });
      }
    });
  }

  register(name: string, email: string, password: string): void {
    this.loginService.register(name, email, password).subscribe({
      next: (response) => {
        this.translate.get('login.notifications.registerSuccess').subscribe((message: string) => {
          this.toastr.success(message);
        });
        this.router.navigate(['/accounts']);
      },
      error: (err) => {
        console.error('Erro no registro:', err);
        this.translate.get('login.notifications.registerFail').subscribe((message: string) => {
          this.toastr.error(message);
        });
      }
    });
  }
}
