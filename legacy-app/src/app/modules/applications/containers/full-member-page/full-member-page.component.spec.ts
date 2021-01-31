import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullMemberPageComponent } from './full-member-page.component';

describe('FullMemberPageComponent', () => {
  let component: FullMemberPageComponent;
  let fixture: ComponentFixture<FullMemberPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FullMemberPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullMemberPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
