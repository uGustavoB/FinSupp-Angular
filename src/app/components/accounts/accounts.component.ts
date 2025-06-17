import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DeleteModalComponent } from '../util/delete-modal/delete-modal.component';
import { Account, AccountsService, Bank } from '../../services/accounts/accounts.service';
import { itemAnimation } from '../../animations/ItemAnimation';
import { CreateAccountModalComponent } from '../inputs/create-accont-modal/create-accont-modal.component';
import { map } from 'rxjs';

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
  accountTypes: ('CHECKING' | 'SAVINGS' | 'INVESTMENT')[] = ['CHECKING'];

  constructor(
    private accountsService: AccountsService
  ) { }

  ngOnInit(): void {
    this.accountsService.loadBanks();

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

  handleCreateAccountConfirm(): void {
    this.showCreateAccountModal = false;
  }

  handleCreateAccountCancel(): void {
    this.showCreateAccountModal = false;
  }

  // Lidar com a exclusão de conta
  openDeleteAccountModal(): void {
    this.showDeleteModal = true;
  }

  handleDeleteAccountConfirm(): void {
    this.showDeleteModal = false;
  }

  handleDeleteAccountCancel(): void {
    this.showDeleteModal = false;
  }
}
