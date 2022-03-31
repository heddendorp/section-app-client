import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateListPageComponent } from './template-list-page.component';

describe('TemplateListPageComponent', () => {
  let component: TemplateListPageComponent;
  let fixture: ComponentFixture<TemplateListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateListPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
