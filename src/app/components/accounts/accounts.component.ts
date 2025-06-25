import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DeleteModalComponent } from '../util/delete-modal/delete-modal.component';
import { Account, AccountsService, Bank } from '../../services/accounts/accounts.service';
import { itemAnimation } from '../../animations/ItemAnimation';
import { CreateAccountData, CreateAccountModalComponent } from '../inputs/create-accont-modal/create-accont-modal.component';
import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-accounts',
  imports: [
    CommonModule,
    MatIconModule,
    DeleteModalComponent,
    CreateAccountModalComponent
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
  animations: [itemAnimation]
})
export class AccountsComponent {
  accounts: Account[] = [];
  loaded: boolean = false;
  showCreateAccountModal: boolean = false;
  showDeleteModal: boolean = false;
  banks: Bank[] = [];
  accountTypes: ('CHECKING' | 'SAVINGS' | 'INVESTMENT')[] = ['CHECKING', 'SAVINGS', 'INVESTMENT'];

  selectedAccountIdToDelete: number | null = null;

  constructor(
    private accountsService: AccountsService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.accountsService.getBanks();

    this.accountsService.getAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        this.loaded = true;
      },
      error: (err) => console.error('Erro ao buscar contas', err)
    });
  }

  getBankNameById(id: number): string {
    const bank = this.accountsService.getBankNameById(id);
    return bank ? bank : 'Banco Desconhecido';
  }

  // Lidar com a criação de conta
  openCreateAccountModal(): void {
    this.banks = this.accountsService.getBanks();
    this.showCreateAccountModal = true;
  }

  handleCreateAccountCreate(formData: CreateAccountData): void {
    this.accountsService.createAccount(formData).pipe(
      map(account => {
        this.accounts.push(account);
        this.toastr.success('Conta criada com sucesso!');
      })
    ).subscribe({
      error: (err) => {
        if (err.status === 409) {
          this.toastr.error('Já existe uma conta com essa descrição.');
        }
      }
    });

    this.showCreateAccountModal = false;
  }

  handleCreateAccountCancel(): void {
    this.showCreateAccountModal = false;
  }

  // Lidar com a exclusão de conta
  openDeleteAccountModal(accountId: number): void {
    this.selectedAccountIdToDelete = accountId;
    this.showDeleteModal = true;
  }

  handleDeleteAccountConfirm(): void {
    if (this.selectedAccountIdToDelete) {
      this.accountsService.deleteAccount(this.selectedAccountIdToDelete).subscribe({
        next: () => {
          this.toastr.success('Conta excluída com sucesso!');
          this.accounts = this.accounts.filter(acc => acc.id !== this.selectedAccountIdToDelete);
        },
        error: (err) => {
          if (err.status === 404) {
            this.toastr.error('Conta não encontrada.');
          } else if (err.status === 409) {
            this.toastr.error('Não é possível excluir uma conta que possui transações ou assinaturas associadas.');
          }
        }
      });
    } else {
      this.toastr.error('Nenhuma conta selecionada para exclusão.');
    }

    this.showDeleteModal = false;
  }

  handleDeleteAccountCancel(): void {
    this.showDeleteModal = false;
  }
}
