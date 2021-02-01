import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberListPageComponent } from './member-list-page.component';

describe('MemberListPageComponent', () => {
  let component: MemberListPageComponent;
  let fixture: ComponentFixture<MemberListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MemberListPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
