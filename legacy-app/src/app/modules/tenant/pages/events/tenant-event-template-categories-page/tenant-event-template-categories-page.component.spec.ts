import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantEventTemplateCategoriesPageComponent } from './tenant-event-template-categories-page.component';

describe('TenantEventTemplateCategoriesPageComponent', () => {
  let component: TenantEventTemplateCategoriesPageComponent;
  let fixture: ComponentFixture<TenantEventTemplateCategoriesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantEventTemplateCategoriesPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      TenantEventTemplateCategoriesPageComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
