import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeTemplateCategoryDialogComponent } from './change-template-category-dialog.component';

describe('ChangeTemplateCategoryDialogComponent', () => {
  let component: ChangeTemplateCategoryDialogComponent;
  let fixture: ComponentFixture<ChangeTemplateCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeTemplateCategoryDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeTemplateCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
