import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DeleteModalComponent } from '../util/delete-modal/delete-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Account, AccountsService } from '../../services/accounts/accounts.service';

@Component({
  selector: 'app-accounts',
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent {
  accounts: Account[] = [];

  constructor(
    private accountsService: AccountsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.accountsService.getAccounts().subscribe({
      next: (data) => this.accounts = data,
      error: (err) => console.error('Erro ao buscar contas', err)
    });
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
