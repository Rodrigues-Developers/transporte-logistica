import { Logistic } from 'src/app/core/interfaces/logistic.interface';
import { Component, OnInit } from '@angular/core';
import { DataShareService } from './../../core/services/data-share.service';
import { Product } from '../../core/interfaces/product.interface';
import { LogisticService } from 'src/app/core/services/logistic.service';
import { ProductService } from 'src/app/core/services/product.service';
import { Router } from '@angular/router';
import { ObjectId } from 'mongodb';
import { Subscription } from 'rxjs';

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
  selectedLogistics: Logistic[] = [];
  productServiceObservable: Subscription = new Subscription();

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

  //Get all logistics from database
  async getLogistics() {
    (await this.logisticService.getAllTravelingLogistic()).subscribe(
      (logistics: Logistic[]) => {
        this.logistics = logistics;
      }
    );
  }

  //Get all products from database.
  async getProducts() {
    this.productServiceObservable = (
      await this.productService.getAllProducts()
    ).subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  getProduct(id: ObjectId) {
    this.productService.getProductById(id).subscribe((product: Product) => {
      this.product = product;
    });
  }

  openSidebar(logis: Logistic) {
    this.details = 'sidebar_details';
    this.backgrond = 'show_backgrond';

    const data = logis; // Data to be sent
    this.dataShareService.setDataLogistic(data);
  }
  closeSidebar() {
    this.details = 'sidebar';
    this.backgrond = 'hide_backgrond';
  }

  /**
   *
   * Include or remove in array selected or unselected item
   * @param {Logistic} logis
   */
  toggleSelection(logis: Logistic): void {
    if (this.isSelected(logis)) {
      this.selectedLogistics = this.selectedLogistics.filter(
        (selected) => selected !== logis
      );
    } else {
      this.selectedLogistics.push(logis);
    }
  }

  /**
   *
   * @param {Logistic} logis
   * @returns verification if is selected
   */
  isSelected(logis: Logistic): boolean {
    return this.selectedLogistics.includes(logis);
  }

  /**
   *
   */
  async receive() {
    for (const logis of this.selectedLogistics) {
      if (logis._id) {
        try {
          const updatedLogistic: Logistic = logis;
          logis.status = 'delivered';
          this.logisticService.updateLogistic(updatedLogistic).subscribe();
        } catch (error) {
          console.error(`Error updating logistics ${logis._id}: ${error}`);
        }
      }
    }
  }

  ngOndestroy(): void {
    this.productServiceObservable.unsubscribe();
  }
}
