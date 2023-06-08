import { Component, OnInit } from '@angular/core';
import { Product } from '../../core/interfaces/product.interface';
import { Logistic } from '../../core/interfaces/logistic.interface';
import { ProductService } from 'src/app/core/services/product.service';
import { LogisticService } from 'src/app/core/services/logistic.service';
import { ObjectId } from 'mongodb';

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

  details = 'sidebar';

  constructor(
    private productService: ProductService,
    private logisticService: LogisticService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.details = 'sidebar';
  }
  //Get all products from database.
  getProducts() {
    this.productService.getAllProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }
  getProduct(id: ObjectId) {
    this.productService.getProductById(id).subscribe((product: Product) => {
      this.product = product;
    });
  }

  callSidebar() {
    this.details = 'sidebar_details';
    console.log(this.details);
  }
}
