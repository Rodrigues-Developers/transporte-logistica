import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service';
import { LogisticService } from 'src/app/core/services/logistic.service';
import { Product } from 'src/app/core/interfaces/product.interface';
import { ActivatedRoute } from '@angular/router';
import { ObjectId } from 'mongodb';
import { Logistic } from 'src/app/core/interfaces/logistic.interface';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less'],
})
export class DetailsComponent implements OnInit {
  product = {} as Product;
  products: Product[] = [];
  productsNfe: Product[] = [];

  logistic = {} as Logistic;
  logistics: Logistic[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService // private logisticService: LogisticService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.getProduct(params);
    });
  }

  getProduct(nfe: any) {
    for (let i = 0; i < nfe.merchandise.length; i++) {
      this.productService
        .getProductById(nfe.merchandise[i])
        .subscribe((product: Product) => {
          this.productsNfe.push(product);
        });
    }
  }
}
