import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorHubComponent } from './tutor-hub.component';

describe('TutorHubComponent', () => {
  let component: TutorHubComponent;
  let fixture: ComponentFixture<TutorHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TutorHubComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
