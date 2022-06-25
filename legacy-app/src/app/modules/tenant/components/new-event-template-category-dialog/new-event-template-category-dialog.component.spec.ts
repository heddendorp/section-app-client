import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEventTemplateCategoryDialogComponent } from './new-event-template-category-dialog.component';

describe('NewEventTemplateCategoryDialogComponent', () => {
  let component: NewEventTemplateCategoryDialogComponent;
  let fixture: ComponentFixture<NewEventTemplateCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewEventTemplateCategoryDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewEventTemplateCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
