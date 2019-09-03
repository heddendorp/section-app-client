import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowUserdataComponent } from './show-userdata.component';

describe('ShowUserdataComponent', () => {
  let component: ShowUserdataComponent;
  let fixture: ComponentFixture<ShowUserdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowUserdataComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowUserdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
