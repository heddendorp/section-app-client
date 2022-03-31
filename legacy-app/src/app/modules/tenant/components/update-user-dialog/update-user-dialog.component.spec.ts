import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserDialogComponent } from './update-user-dialog.component';

describe('UpdateUserDialogComponent', () => {
  let component: UpdateUserDialogComponent;
  let fixture: ComponentFixture<UpdateUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateUserDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
