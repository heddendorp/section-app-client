import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimEventDialogComponent } from './claim-event-dialog.component';

describe('ClaimEventDialogComponent', () => {
  let component: ClaimEventDialogComponent;
  let fixture: ComponentFixture<ClaimEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClaimEventDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
