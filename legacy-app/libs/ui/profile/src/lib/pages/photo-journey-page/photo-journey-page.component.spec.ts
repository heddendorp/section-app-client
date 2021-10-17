import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoJourneyPageComponent } from './photo-journey-page.component';

describe('PhotoJourneyPageComponent', () => {
  let component: PhotoJourneyPageComponent;
  let fixture: ComponentFixture<PhotoJourneyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoJourneyPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoJourneyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
