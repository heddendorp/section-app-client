import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesPageComponent } from './purchases-page.component';

describe('PurchasesPageComponent', () => {
  let component: PurchasesPageComponent;
  let fixture: ComponentFixture<PurchasesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
