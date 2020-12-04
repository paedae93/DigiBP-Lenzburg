import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakePrescriptionComponent } from './take-prescription.component';

describe('TakePrescriptionComponent', () => {
  let component: TakePrescriptionComponent;
  let fixture: ComponentFixture<TakePrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TakePrescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TakePrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
