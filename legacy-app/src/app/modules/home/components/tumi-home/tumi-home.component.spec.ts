import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TumiHomeComponent } from './tumi-home.component';

describe('TumiHomeComponent', () => {
  let component: TumiHomeComponent;
  let fixture: ComponentFixture<TumiHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TumiHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TumiHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
