import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataItemsManagerComponent } from './data-items-manager.component';

describe('DataItemsManagerComponent', () => {
  let component: DataItemsManagerComponent;
  let fixture: ComponentFixture<DataItemsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataItemsManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataItemsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
