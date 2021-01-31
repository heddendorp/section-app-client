import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedApplicationsPageComponent } from './submitted-applications-page.component';

describe('SubmittedApplicationsPageComponent', () => {
  let component: SubmittedApplicationsPageComponent;
  let fixture: ComponentFixture<SubmittedApplicationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmittedApplicationsPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittedApplicationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
