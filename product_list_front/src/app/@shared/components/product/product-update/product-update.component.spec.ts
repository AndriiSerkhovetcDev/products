import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductUpdateComponent } from './product-update.component';

describe('ProductDetailsComponent', () => {
  let component: ProductUpdateComponent;
  let fixture: ComponentFixture<ProductUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductUpdateComponent]
    });
    fixture = TestBed.createComponent(ProductUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
