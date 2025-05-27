import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DeleteModalComponent } from '../util/delete-modal/delete-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-accounts',
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent {
  accounts = [
    {
      id: 1,
      description: 'Conta principal',
      bank: 'Banco do Brasil',
      accountType: 'Corrente',
      balance: 1500.00,
      closingDay: 3,
      paymentDueDay: 10,
    },
    {
      id: 2,
      description: 'Conta de poupança',
      bank: 'Caixa Econômica Federal',
      accountType: 'Poupança',
      balance: 5000.00,
      closingDay: 5,
      paymentDueDay: 15,
    },
    {
      id: 3,
      description: 'Cartão de crédito',
      bank: 'Itaú',
      accountType: 'Crédito',
      balance: -200.00,
      closingDay: 10,
      paymentDueDay: 20,
    }
  ];

  constructor(private dialog: MatDialog) { }

  openDeleteModal(): void {
    const dialogRef = this.dialog.open(DeleteModalComponent,
      {
        data: {
          name: "conta"
        }
      }
    );
  }
}
