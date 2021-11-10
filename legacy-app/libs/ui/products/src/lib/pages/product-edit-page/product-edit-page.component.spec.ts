import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEditPageComponent } from './product-edit-page.component';

describe('ProductEditPageComponent', () => {
  let component: ProductEditPageComponent;
  let fixture: ComponentFixture<ProductEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductEditPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
