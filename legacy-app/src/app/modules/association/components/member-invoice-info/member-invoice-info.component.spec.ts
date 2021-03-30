import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberInvoiceInfoComponent } from './member-invoice-info.component';

describe('MemberInvoiceInfoComponent', () => {
  let component: MemberInvoiceInfoComponent;
  let fixture: ComponentFixture<MemberInvoiceInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberInvoiceInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberInvoiceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
