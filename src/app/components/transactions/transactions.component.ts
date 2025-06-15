import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { itemAnimation } from '../../animations/ItemAnimation';

export interface Transaction {
  id: number,
  description: string,
  amount: number,
  addToBill: boolean,
  installments: number
  transactionDate: string
  type: 'WITHDRAW' | 'DEPOSIT' | 'TRANSFER',
  category: number,
  accountId: number,
  recipientAccountId?: number
}

@Component({
  selector: 'app-transactions',
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
  animations: [itemAnimation]
})
export class TransactionsComponent {
  loaded: boolean = false;

  transactions: Transaction[] = [
  {
    "id": 405,
    "description": "Crédito",
    "amount": 25,
    "addToBill": false,
    "installments": 1,
    "transactionDate": "2025-06-09",
    "type": "WITHDRAW",
    "category": 4,
    "accountId": 100,
    "recipientAccountId": undefined
  },
  {
    "id": 404,
    "description": "Taxa Ejc",
    "amount": 60,
    "addToBill": false,
    "installments": 1,
    "transactionDate": "2025-06-09",
    "type": "WITHDRAW",
    "category": 133,
    "accountId": 100,
    "recipientAccountId": undefined
  },
  {
    "id": 406,
    "description": "Doação Softcom",
    "amount": 10,
    "addToBill": false,
    "installments": 1,
    "transactionDate": "2025-06-09",
    "type": "WITHDRAW",
    "category": 133,
    "accountId": 100,
    "recipientAccountId": undefined
  },
  {
    "id": 403,
    "description": "Gasolina",
    "amount": 50,
    "addToBill": false,
    "installments": 1,
    "transactionDate": "2025-06-09",
    "type": "WITHDRAW",
    "category": 2,
    "accountId": 100,
    "recipientAccountId": undefined
  },
  {
    "id": 400,
    "description": "Payment of the bill: 5/2025",
    "amount": 1101.285,
    "addToBill": false,
    "installments": 1,
    "transactionDate": "2025-06-03",
    "type": "WITHDRAW",
    "category": 8,
    "accountId": 100,
    "recipientAccountId": undefined
  },
  {
    "id": 401,
    "description": "Salário",
    "amount": 1470,
    "addToBill": false,
    "installments": 1,
    "transactionDate": "2025-06-03",
    "type": "DEPOSIT",
    "category": 102,
    "accountId": 100,
    "recipientAccountId": undefined
  },
  {
    "id": 397,
    "description": "Capa Iphone",
    "amount": 21,
    "addToBill": false,
    "installments": 1,
    "transactionDate": "2025-06-03",
    "type": "WITHDRAW",
    "category": 101,
    "accountId": 100,
    "recipientAccountId": undefined
  },
  {
    "id": 398,
    "description": "Iphone",
    "amount": 4432,
    "addToBill": true,
    "installments": 24,
    "transactionDate": "2025-06-03",
    "type": "WITHDRAW",
    "category": 101,
    "accountId": 100,
    "recipientAccountId": undefined
  },
  {
    "id": 399,
    "description": "Carregador",
    "amount": 101,
    "addToBill": true,
    "installments": 2,
    "transactionDate": "2025-06-03",
    "type": "WITHDRAW",
    "category": 101,
    "accountId": 100,
    "recipientAccountId": undefined
  },
  {
    "id": 402,
    "description": "Moto",
    "amount": 510,
    "addToBill": false,
    "installments": 1,
    "transactionDate": "2025-06-03",
    "type": "WITHDRAW",
    "category": 2,
    "accountId": 100,
    "recipientAccountId": undefined
  }
]

  ngOnInit() {
    setTimeout(() => {
      this.loaded = true;
    }, 1000);
  }
}
