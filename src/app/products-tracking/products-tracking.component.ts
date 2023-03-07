import { Component, OnInit } from '@angular/core';
import { LogisticService } from './../logistic.service';
import { ProductService } from '../product.service';
import { Product } from '../interfaces/product.interface';
import { Logistic } from '../interfaces/logistic.interface';

@Component({
  selector: 'app-products-tracking',
  templateUrl: './products-tracking.component.html',
  styleUrls: ['./products-tracking.component.less'],
})
export class ProductsTrackingComponent implements OnInit {
  product = {} as Product;
  products: Product[] = [];

  logistic = {} as Logistic;
  logistics: Logistic[] = [];

  constructor(
    private productService: ProductService,
    private logisticService: LogisticService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }
  //Get all products from database.
  getProducts() {
    this.productService.getAllProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }
  getProduct(id: string) {
    this.productService.getProductById(id).subscribe((product: Product) => {
      this.product = product;
    });
  }
}
