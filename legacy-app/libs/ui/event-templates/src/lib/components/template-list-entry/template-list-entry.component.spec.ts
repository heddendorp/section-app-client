import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateListEntryComponent } from './template-list-entry.component';

describe('TemplateListEntryComponent', () => {
  let component: TemplateListEntryComponent;
  let fixture: ComponentFixture<TemplateListEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateListEntryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
