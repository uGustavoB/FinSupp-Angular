import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { fadeSlide } from '../../../animations/FadeSlide';
import { Bank } from '../../../services/accounts/accounts.service';

@Component({
  selector: 'app-create-account-modal',
  imports: [
    MatIconModule
  ],
  templateUrl: './create-accont-modal.component.html',
  styleUrl: './create-accont-modal.component.css',
  animations: [fadeSlide]
})
export class CreateAccountModalComponent {
  @Input() banks: Bank[] = [];
  @Input() accountTypes: any[] = [];

  @Output() create = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onCreate(): void {
    this.create.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
