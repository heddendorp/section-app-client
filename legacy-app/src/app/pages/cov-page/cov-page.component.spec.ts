import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovPageComponent } from './cov-page.component';

describe('CovPageComponent', () => {
  let component: CovPageComponent;
  let fixture: ComponentFixture<CovPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CovPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
