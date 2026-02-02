import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSubscriptionModalComponent } from './filter-subscription-modal.component';

describe('FilterSubscriptionModalComponent', () => {
  let component: FilterSubscriptionModalComponent;
  let fixture: ComponentFixture<FilterSubscriptionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterSubscriptionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterSubscriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
