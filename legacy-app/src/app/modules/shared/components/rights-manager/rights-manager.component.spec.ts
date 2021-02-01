import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightsManagerComponent } from './rights-manager.component';

describe('RightsManagerComponent', () => {
  let component: RightsManagerComponent;
  let fixture: ComponentFixture<RightsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RightsManagerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RightsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
