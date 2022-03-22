import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantOrganizersPageComponent } from './tenant-organizers-page.component';

describe('TenantOrganizersPageComponent', () => {
  let component: TenantOrganizersPageComponent;
  let fixture: ComponentFixture<TenantOrganizersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantOrganizersPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantOrganizersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
