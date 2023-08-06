import { DataShareService } from './../../core/services/data-share.service';
import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service';
import { LogisticService } from 'src/app/core/services/logistic.service';
import { Product } from 'src/app/core/interfaces/product.interface';
import { ActivatedRoute } from '@angular/router';
import { ObjectId } from 'mongodb';
import { Logistic } from 'src/app/core/interfaces/logistic.interface';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less'],
})

// TODO turn this page generic to use in any component

export class DetailsComponent implements OnInit {
  product = {} as Product;
  products: Product[] = [];
  productsNfe: Product[] = [];

  logistic = {} as Logistic;
  logistics: Logistic[] = [];

  //Lib to observe the changes in the logistic.
  private logisticObservable: Observable<Logistic>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService, // private logisticService: LogisticService
    private dataShareService: DataShareService // Received the data from another page
  ) {
    this.logisticObservable = this.dataShareService.getDataObservable(); // Get the data from another page
  }

  ngOnInit(): void {
    this.getProduct(this.logistic);
  }

  async getProduct(nfe: any) {
    try{
      for (let i = 0; i < nfe.merchandise.length; i++) {
        await this.productService
          .getProductById(nfe.merchandise[i])
          .subscribe((product: Product) => {
            this.productsNfe.push(product);
            console.log("in");
          });
    }
    } catch {
      console.error("Details error")
    }
  }
}
