import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDataDialogComponent } from './show-data-dialog.component';

describe('ShowDataDialogComponent', () => {
  let component: ShowDataDialogComponent;
  let fixture: ComponentFixture<ShowDataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowDataDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
