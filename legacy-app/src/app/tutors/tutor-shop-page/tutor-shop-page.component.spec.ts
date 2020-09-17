import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorShopPageComponent } from './tutor-shop-page.component';

describe('TutorShopPageComponent', () => {
  let component: TutorShopPageComponent;
  let fixture: ComponentFixture<TutorShopPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorShopPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorShopPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
