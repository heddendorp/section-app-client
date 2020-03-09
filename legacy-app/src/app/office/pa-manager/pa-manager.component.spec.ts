import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaManagerComponent } from './pa-manager.component';

describe('PaManagerComponent', () => {
  let component: PaManagerComponent;
  let fixture: ComponentFixture<PaManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaManagerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
