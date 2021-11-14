import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketOverviewPageComponent } from './basket-overview-page.component';

describe('BasketOverviewPageComponent', () => {
  let component: BasketOverviewPageComponent;
  let fixture: ComponentFixture<BasketOverviewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasketOverviewPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketOverviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
