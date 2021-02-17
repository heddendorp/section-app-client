import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingPageComponent } from './incoming-page.component';

describe('IncomingPageComponent', () => {
  let component: IncomingPageComponent;
  let fixture: ComponentFixture<IncomingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncomingPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
