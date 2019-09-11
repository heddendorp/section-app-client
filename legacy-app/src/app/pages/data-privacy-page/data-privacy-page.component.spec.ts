import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPrivacyPageComponent } from './data-privacy-page.component';

describe('DataPrivacyPageComponent', () => {
  let component: DataPrivacyPageComponent;
  let fixture: ComponentFixture<DataPrivacyPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataPrivacyPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPrivacyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
