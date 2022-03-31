import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataItemsCollectorComponent } from './data-items-collector.component';

describe('DataItemsCollectorComponent', () => {
  let component: DataItemsCollectorComponent;
  let fixture: ComponentFixture<DataItemsCollectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataItemsCollectorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataItemsCollectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
