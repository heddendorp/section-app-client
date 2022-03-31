import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPhotoPageComponent } from './event-photo-page.component';

describe('EventPhotoPageComponent', () => {
  let component: EventPhotoPageComponent;
  let fixture: ComponentFixture<EventPhotoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventPhotoPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventPhotoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
