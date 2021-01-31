import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageApplicationsPageComponent } from './manage-applications-page.component';

describe('ManageApplicationsPageComponent', () => {
  let component: ManageApplicationsPageComponent;
  let fixture: ComponentFixture<ManageApplicationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageApplicationsPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageApplicationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
