import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForInterestedPageComponent } from './for-interested-page.component';

describe('ForInterestedPageComponent', () => {
  let component: ForInterestedPageComponent;
  let fixture: ComponentFixture<ForInterestedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForInterestedPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForInterestedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
