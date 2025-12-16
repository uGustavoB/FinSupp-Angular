import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { fadeSlide } from '../../../animations/FadeSlide';
import { Category } from '../../../services/categories/categories.service';

export interface CreateCategoryData {
  description: string;
}

@Component({
  selector: 'app-create-category-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './create-category-modal.component.html',
  styleUrl: './create-category-modal.component.css',
  animations: [fadeSlide]
})
export class CreateCategoryModalComponent implements OnInit {

  @Input() initialData: Category | null = null;
  @Input() isEditMode = false;

  @Output() create = new EventEmitter<CreateCategoryData>();
  @Output() cancel = new EventEmitter<void>();

  description = '';

  ngOnInit(): void {
    if (this.initialData) {
      this.description = this.initialData.description;
    }
  }

  submit(): void {
    if (!this.description.trim()) return;

    this.create.emit({
      description: this.description
    });
  }

  close(): void {
    this.cancel.emit();
  }
}
