import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-delete-modal',
  imports: [
    MatIconModule
  ],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css',
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 })),
      ])
    ])
  ]
})
export class DeleteModalComponent {
  @Input() title: string = '';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
