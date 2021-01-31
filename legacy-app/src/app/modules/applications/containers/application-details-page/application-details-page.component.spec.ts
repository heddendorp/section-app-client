import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDetailsPageComponent } from './application-details-page.component';

describe('ApplicationDetailsPageComponent', () => {
  let component: ApplicationDetailsPageComponent;
  let fixture: ComponentFixture<ApplicationDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationDetailsPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
