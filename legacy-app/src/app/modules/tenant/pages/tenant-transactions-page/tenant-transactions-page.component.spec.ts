import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantTransactionsPageComponent } from './tenant-transactions-page.component';

describe('TenantTransactionsPageComponent', () => {
  let component: TenantTransactionsPageComponent;
  let fixture: ComponentFixture<TenantTransactionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantTransactionsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantTransactionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
