import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserInformationDialogComponent } from './update-user-information-dialog.component';

describe('UpdateUserInformationDialogComponent', () => {
  let component: UpdateUserInformationDialogComponent;
  let fixture: ComponentFixture<UpdateUserInformationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateUserInformationDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserInformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
