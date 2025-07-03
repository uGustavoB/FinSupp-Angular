import { CommonModule } from '@angular/common';
import { Component, computed, effect, OnDestroy, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DeleteModalComponent } from '../util/delete-modal/delete-modal.component';
import { Account, AccountsService, Bank } from '../../services/accounts/accounts.service';
import { itemAnimation } from '../../animations/ItemAnimation';
import { CreateAccountData, CreateAccountModalComponent } from '../inputs/create-accont-modal/create-accont-modal.component';
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
export class AccountsComponent implements OnInit, OnDestroy{
  showCreateAccountModal = false;
  showDeleteModal = false;
  selectedAccountIdToDelete: number | null = null;

  loaded = signal(false);
  accountTypes: ('CHECKING' | 'SAVINGS' | 'INVESTMENT')[] = ['CHECKING', 'SAVINGS', 'INVESTMENT'];

  accounts = computed(() => this.accountsService.getAccountsSignal());
  banks = computed(() => this.accountsService.getBanks());

  constructor(
    private accountsService: AccountsService,
    private toastr: ToastrService
  ) {
    effect(() => {
      if (this.accounts().length > 0) {
        this.loaded.set(true);
      }
    });
  }

  ngOnInit(): void {
    this.accountsService.getAccountsSignal();
    this.accountsService.getBanks();
  }

  ngOnDestroy(): void {
    this.accountsService.resetAccounts();
  }

  getBankNameById(id: number): string {
    return this.accountsService.getBankNameById(id);
  }

  openCreateAccountModal(): void {
    this.showCreateAccountModal = true;
  }

  handleCreateAccountCreate(formData: CreateAccountData): void {
    this.accountsService.createAccount(formData).subscribe({
      next: () => {
        this.toastr.success('Conta criada com sucesso!');
      },
      error: (err) => {
        if (err.status === 409) {
          this.toastr.error('Já existe uma conta com essa descrição.');
        } else {
          this.toastr.error('Erro ao criar conta.');
        }
      }
    });

    this.showCreateAccountModal = false;
  }

  handleCreateAccountCancel(): void {
    this.showCreateAccountModal = false;
  }

  openDeleteAccountModal(accountId: number): void {
    this.selectedAccountIdToDelete = accountId;
    this.showDeleteModal = true;
  }

  handleDeleteAccountConfirm(): void {
    if (!this.selectedAccountIdToDelete) {
      this.toastr.error('Nenhuma conta selecionada para exclusão.');
      return;
    }

    this.accountsService.deleteAccount(this.selectedAccountIdToDelete).subscribe({
      next: () => {
        this.toastr.success('Conta excluída com sucesso!');
      },
      error: (err) => {
        if (err.status === 404) {
          this.toastr.error('Conta não encontrada.');
        } else if (err.status === 409) {
          this.toastr.error('Não é possível excluir uma conta com transações ou assinaturas.');
        } else {
          this.toastr.error('Erro ao excluir conta.');
        }
      }
    });

    this.showDeleteModal = false;
  }

  handleDeleteAccountCancel(): void {
    this.showDeleteModal = false;
  }
}
