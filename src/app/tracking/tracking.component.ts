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
  getLogistics() {
    this.logisticService.getAllLogistcs().subscribe((logistics: Logistic[]) => {
      this.logistics = logistics;
    });
  }
  getProducts() {
    this.productService.getAllProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }
}
