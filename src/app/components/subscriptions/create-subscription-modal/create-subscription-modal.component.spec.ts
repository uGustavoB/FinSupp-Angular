import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubscriptionModalComponent } from './create-subscription-modal.component';

describe('CreateSubscriptionModalComponent', () => {
  let component: CreateSubscriptionModalComponent;
  let fixture: ComponentFixture<CreateSubscriptionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSubscriptionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSubscriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
