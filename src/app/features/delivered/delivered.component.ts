import { Component, OnInit } from '@angular/core';
import { DataShareService } from './../../core/services/data-share.service';
import { DetailsComponent } from './../../shared/details/details.component';
import { Product } from '../../core/interfaces/product.interface';
import { Logistic } from '../../core/interfaces/logistic.interface';
import { LogisticService } from 'src/app/core/services/logistic.service';
import { ProductService } from 'src/app/core/services/product.service';
import { Router } from '@angular/router';
import { ObjectId } from 'mongodb';

@Component({
  selector: 'app-delivered',
  templateUrl: './delivered.component.html',
  styleUrls: ['./delivered.component.less'],
})
export class DeliveredComponent {
  product = {} as Product;
  products: Product[] = [];

  logistic = {} as Logistic;
  logistics: Logistic[] = [];

  showDetails = false;
  details = 'sidebar';
  backgrond = 'hide_backgrond';

  constructor(
    private productService: ProductService,
    private logisticService: LogisticService,
    private dataShareService: DataShareService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.details = 'sidebar';
    this.backgrond = 'hide_backgrond';

    this.getLogistics();
  }

  /**
   * Get all delivered logistics from data base
   */
  async getLogistics() {
    (await this.logisticService.getAllDeliveredLogistics()).subscribe(
      (logistics: Logistic[]) => {
        this.logistics = logistics;
      }
    );
  }

  /**
   * Get all products from database.
   */
  async getProducts() {
    (await this.productService.getAllProducts()).subscribe(
      (products: Product[]) => {
        this.products = products;
      }
    );
  }

  /**
   * 
   * @param {ObjectId} id  The id of products from database
   */
  getProduct(id: ObjectId) {
    this.productService.getProductById(id).subscribe((product: Product) => {
      this.product = product;
    });
  }

  /**
   * 
   * @param {Logistic} logis 
   */
  openSidebar(logis: Logistic) {
    this.showDetails = true;
    this.details = 'sidebar_details';
    this.backgrond = 'show_backgrond';

    const data = logis; // Data to be passed
    this.dataShareService.setData(data);
    
  }

  /**
   * Close the sidebar information
   */
  closeSidebar() {
    this.showDetails = false;
    this.details = 'sidebar';
    this.backgrond = 'hide_backgrond';
  }

}
