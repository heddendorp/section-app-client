import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantEditPageComponent } from './tenant-edit-page.component';

describe('TenantEditPageComponent', () => {
  let component: TenantEditPageComponent;
  let fixture: ComponentFixture<TenantEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantEditPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
