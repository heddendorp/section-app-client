import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveToolbarComponent } from './reactive-toolbar.component';

describe('RatingComponent', () => {
  let component: ReactiveToolbarComponent;
  let fixture: ComponentFixture<ReactiveToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReactiveToolbarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactiveToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
