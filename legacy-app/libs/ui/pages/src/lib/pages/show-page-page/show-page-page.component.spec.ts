import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPagePageComponent } from './show-page-page.component';

describe('ShowPagePageComponent', () => {
  let component: ShowPagePageComponent;
  let fixture: ComponentFixture<ShowPagePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowPagePageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
