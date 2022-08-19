import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingItemComponent } from './rating-item.component';

describe('RatingItemComponent', () => {
  let component: RatingItemComponent;
  let fixture: ComponentFixture<RatingItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
