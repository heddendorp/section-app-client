import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantPhotosPageComponent } from './tenant-photos-page.component';

describe('TenantPhotosPageComponent', () => {
  let component: TenantPhotosPageComponent;
  let fixture: ComponentFixture<TenantPhotosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantPhotosPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantPhotosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
