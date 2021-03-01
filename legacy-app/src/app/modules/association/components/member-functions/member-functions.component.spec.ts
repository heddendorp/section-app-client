import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberFunctionsComponent } from './member-functions.component';

describe('MemberFunctionsComponent', () => {
  let component: MemberFunctionsComponent;
  let fixture: ComponentFixture<MemberFunctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MemberFunctionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
