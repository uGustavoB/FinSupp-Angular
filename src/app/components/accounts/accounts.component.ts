import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DeleteModalComponent } from '../util/delete-modal/delete-modal.component';
import { Account, AccountsService, Bank } from '../../services/accounts/accounts.service';
import { itemAnimation } from '../../animations/ItemAnimation';
import { CreateAccountData, CreateAccountModalComponent } from '../inputs/create-accont-modal/create-accont-modal.component';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-accounts',
  imports: [
    CommonModule,
    MatIconModule,
    DeleteModalComponent,
    CreateAccountModalComponent,
    TranslateModule
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
  animations: [itemAnimation]
})
export class AccountsComponent implements OnInit, OnDestroy{
  private translate = inject(TranslateService);

  showCreateAccountModal = false;
  showDeleteModal = false;
  selectedAccountIdToDelete: number | null = null;
  selectedAccountToEdit: CreateAccountData | null = null;

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
    // this.accountsService.getBanks();
  }

  ngOnDestroy(): void {
    this.accountsService.resetAccounts();
  }

  getBankNameById(id: number): string {
    return this.accountsService.getBankNameById(id);
  }

  openCreateAccountModal(): void {
    this.selectedAccountToEdit = null;
    this.showCreateAccountModal = true;
  }

  openEditAccountModal(account: Account): void {
    this.selectedAccountToEdit = {
      id: account.id,
      description: account.description,
      // accountType: account.accountType as 'CHECKING' | 'SAVINGS' | 'INVESTMENTS',
      // bank: account.bank,
      balance: account.balance,
      closingDay: account.closingDay,
      paymentDueDay: account.paymentDueDay
    };
    this.showCreateAccountModal = true;
  }

  handleAccountSave(formData: CreateAccountData): void {
    if (formData.id) {
      // EDIT
      this.accountsService.updateAccount(formData).subscribe({
        next: () => {
          // this.toastr.success('Conta atualizada com sucesso!');
          this.translate.get('notifications.accountSaveSuccess').subscribe((message: string) => {
            this.toastr.success(message);
          });
        },
        error: (err) => {
          if (err.status === 404) {
            this.translate.get('notifications.accountNotFound').subscribe((message: string) => {
              this.toastr.error(message);
            });
          } else if (err.status === 409) {
            this.translate.get('notifications.accountAlreadyExists').subscribe((message: string) => {
              this.toastr.error(message);
            });
          } else {
            this.translate.get('notifications.accountSaveError').subscribe((message: string) => {
              this.toastr.error(message);
            });
          }
        }
      });
    } else {
      // CREATE
      this.accountsService.createAccount(formData).subscribe({
        next: () => {
          this.translate.get('notifications.accountCreateSuccess').subscribe((message: string) => {
            this.toastr.success(message);
          });
        },
        error: (err) => {
          if (err.status === 409) {
            this.translate.get('notifications.accountAlreadyExists').subscribe((message: string) => {
              this.toastr.error(message);
            });
          } else {
            this.translate.get('notifications.accountSaveError').subscribe((message: string) => {
              this.toastr.error(message);
            });
          }
        }
      });
    }

    this.showCreateAccountModal = false;
    this.selectedAccountToEdit = null;
  }

  handleAccountCancel(): void {
    this.showCreateAccountModal = false;
    this.selectedAccountToEdit = null;
  }

  openDeleteAccountModal(accountId: number): void {
    this.selectedAccountIdToDelete = accountId;
    this.showDeleteModal = true;
  }

  handleDeleteAccountConfirm(): void {
    if (!this.selectedAccountIdToDelete) {
      this.translate.get('notifications.noAccountSelected').subscribe((message: string) => {
        this.toastr.error(message);
      });
      return;
    }

    this.accountsService.deleteAccount(this.selectedAccountIdToDelete).subscribe({
      next: () => {
        this.translate.get('notifications.accountDeleteSuccess').subscribe((message: string) => {
          this.toastr.success(message);
        });
      },
      error: (err) => {
        if (err.status === 404) {
          this.translate.get('notifications.accountNotFound').subscribe((message: string) => {
            this.toastr.error(message);
          });
        } else if (err.status === 409) {
          this.translate.get('notifications.account.deleteError').subscribe((message: string) => {
            this.toastr.error(message);
          });
        } else {
          this.translate.get('notifications.accountSaveError').subscribe((message: string) => {
            this.toastr.error(message);
          });
        }
      }
    });

    this.showDeleteModal = false;
  }

  handleDeleteAccountCancel(): void {
    this.showDeleteModal = false;
  }
}
