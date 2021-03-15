import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullMemberApplicationDetailsComponent } from './full-member-application-details.component';

describe('FullMemberApplicationDetailsComponent', () => {
  let component: FullMemberApplicationDetailsComponent;
  let fixture: ComponentFixture<FullMemberApplicationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullMemberApplicationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullMemberApplicationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
