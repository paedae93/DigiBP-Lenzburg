import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePrescriptionComponent } from './choose-prescription.component';

describe('ChoosePrescriptionComponent', () => {
  let component: ChoosePrescriptionComponent;
  let fixture: ComponentFixture<ChoosePrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoosePrescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosePrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
