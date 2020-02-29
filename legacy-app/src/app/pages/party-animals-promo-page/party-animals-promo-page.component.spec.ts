import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyAnimalsPromoPageComponent } from './party-animals-promo-page.component';

describe('PartyAnimalsPromoPageComponent', () => {
  let component: PartyAnimalsPromoPageComponent;
  let fixture: ComponentFixture<PartyAnimalsPromoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PartyAnimalsPromoPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyAnimalsPromoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
