import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { fadeSlide } from '../../../animations/FadeSlide';

@Component({
  selector: 'app-delete-modal',
  imports: [
    MatIconModule
  ],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css',
  animations: [fadeSlide]
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
