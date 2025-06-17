import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccontModalComponent } from './create-accont-modal.component';

describe('CreateAccontModalComponent', () => {
  let component: CreateAccontModalComponent;
  let fixture: ComponentFixture<CreateAccontModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAccontModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccontModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
