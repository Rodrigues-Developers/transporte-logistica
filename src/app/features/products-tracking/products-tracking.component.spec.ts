import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsTrackingComponent } from './products-tracking.component';

describe('ProductsTrackingComponent', () => {
  let component: ProductsTrackingComponent;
  let fixture: ComponentFixture<ProductsTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsTrackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
