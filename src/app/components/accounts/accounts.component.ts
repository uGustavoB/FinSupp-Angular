import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DeleteModalComponent } from '../util/delete-modal/delete-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Account, AccountsService } from '../../services/accounts/accounts.service';
import { itemAnimation } from '../../animations/ItemAnimation';

@Component({
  selector: 'app-accounts',
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
  animations: [itemAnimation]
})
export class AccountsComponent {
  accounts: Account[] = [];
  loaded: boolean = false;

  constructor(
    private accountsService: AccountsService,
    private dialog: MatDialog
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

  openDeleteModal(): void {
    this.dialog.open(DeleteModalComponent,
      {
        data: {
          name: "conta"
        },
        backdropClass: 'blurred-backdrop'
      }
    );
  }
}
