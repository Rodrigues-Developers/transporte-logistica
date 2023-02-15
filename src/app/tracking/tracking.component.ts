import { LogisticService } from './../logistic.service';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../interfaces/product.interface';
import { Logistic } from '../interfaces/logistic.interface';
import { NgForm } from '@angular/forms';

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
