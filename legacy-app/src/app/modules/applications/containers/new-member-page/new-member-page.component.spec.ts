import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMemberPageComponent } from './new-member-page.component';

describe('NewMemberPageComponent', () => {
  let component: NewMemberPageComponent;
  let fixture: ComponentFixture<NewMemberPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewMemberPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMemberPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
