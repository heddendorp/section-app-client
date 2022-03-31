import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoDetailsDialogComponent } from './photo-details-dialog.component';

describe('PhotoDetailsDialogComponent', () => {
  let component: PhotoDetailsDialogComponent;
  let fixture: ComponentFixture<PhotoDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
