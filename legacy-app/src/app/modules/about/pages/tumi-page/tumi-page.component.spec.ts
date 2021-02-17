import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TumiPageComponent } from './tumi-page.component';

describe('TumiPageComponent', () => {
  let component: TumiPageComponent;
  let fixture: ComponentFixture<TumiPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TumiPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TumiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
