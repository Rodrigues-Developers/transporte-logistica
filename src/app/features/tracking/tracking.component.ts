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
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.less'],
})
export class TrackingComponent implements OnInit {
  product = {} as Product;
  products: Product[] = [];

  logistic = {} as Logistic;
  logistics: Logistic[] = [];

  // showDetails = false;
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
    (await this.logisticService.getAllLogistcs()).subscribe((logistics: Logistic[]) => {
      this.logistics = logistics;
    });
  }

  //Get all products from database.
  async getProducts() {
    (await this.productService.getAllProducts()).subscribe((products: Product[]) => {
      this.products = products;
    });
  }
  getProduct(id: ObjectId) {
    this.productService.getProductById(id).subscribe((product: Product) => {
      this.product = product;
    });
  }

  openSidebar(logis: Logistic) {
    // this.showDetails = true;
    this.details = 'sidebar_details';
    this.backgrond = 'show_backgrond';

    const data = logis; // Data to be sent
    this.dataShareService.setDataLogistic(data);
    // this.router.navigate(['/details'], { queryParams: data });
  }
  closeSidebar() {
    // this.showDetails = false;
    this.details = 'sidebar';
    this.backgrond = 'hide_backgrond';
  }

  getCheckBoxes() {
    const selectedLogisIds: string[] = [];
    const selectedCheckboxes: NodeListOf<HTMLInputElement> =
      document.querySelectorAll('input[type="checkbox"]:checked');
    selectedCheckboxes.forEach((checkbox: HTMLInputElement) => {
      const id = checkbox.id;
      selectedLogisIds.push(id);
    });

    console.log(selectedLogisIds);
  }

  recive() {
    this.getCheckBoxes();
    //TODO whem add a new atribute in object, change here to recived.
  }
}
