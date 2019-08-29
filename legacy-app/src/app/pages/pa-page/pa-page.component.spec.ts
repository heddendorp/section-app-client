import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaPageComponent } from './pa-page.component';

describe('PaPageComponent', () => {
  let component: PaPageComponent;
  let fixture: ComponentFixture<PaPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
