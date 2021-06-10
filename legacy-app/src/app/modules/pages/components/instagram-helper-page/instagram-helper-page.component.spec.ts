import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramHelperPageComponent } from './instagram-helper-page.component';

describe('IsntagramHelperComponent', () => {
  let component: InstagramHelperPageComponent;
  let fixture: ComponentFixture<InstagramHelperPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstagramHelperPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramHelperPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
