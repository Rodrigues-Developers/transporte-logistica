import { Component, OnInit } from '@angular/core';
import { Product } from '../../core/interfaces/product.interface';
import { Logistic } from '../../core/interfaces/logistic.interface';
import { LogisticService } from 'src/app/core/services/logistic.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.less'],
})
export class TrackingComponent implements OnInit {
  product = {} as Product;
  products: Product[] = [];

  logistic = {} as Logistic;
  logistics: Logistic[] = [];

  constructor(
    private productService: ProductService,
    private logisticService: LogisticService
  ) {}

  ngOnInit(): void {
    this.getLogistics();
  }
  //Get all logistics from database
  getLogistics() {
    this.logisticService.getAllLogistcs().subscribe((logistics: Logistic[]) => {
      this.logistics = logistics;
    });
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
