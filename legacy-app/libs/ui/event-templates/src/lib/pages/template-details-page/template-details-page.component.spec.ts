import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDetailsPageComponent } from './template-details-page.component';

describe('TemplateDetailsPageComponent', () => {
  let component: TemplateDetailsPageComponent;
  let fixture: ComponentFixture<TemplateDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateDetailsPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
