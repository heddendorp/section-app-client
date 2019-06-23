import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanRequestComponent } from './scan-request.component';

describe('ScanRequestComponent', () => {
  let component: ScanRequestComponent;
  let fixture: ComponentFixture<ScanRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScanRequestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
