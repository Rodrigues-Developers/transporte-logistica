import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/core/interfaces/product.interface';
import { ActivatedRoute } from '@angular/router';
import { Logistic } from 'src/app/core/interfaces/logistic.interface';
import { DataShareService } from './../../core/services/data-share.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less'],
})

export class DetailsComponent implements OnInit, OnDestroy {
  product = {} as Product;
  products: Product[] = [];
  productsNfe: Product[] = [];

  logistic = {} as Logistic;
  logistics: Logistic[] = [];

  private logisticObservableSubscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private dataShareService: DataShareService
  ) {}

  ngOnInit(): void {
    this.logisticObservableSubscription = this.dataShareService
      .getDataObservable()
      .subscribe((newLogistic: Logistic) => {
        this.logistic = newLogistic;
        this.getProduct(this.logistic);
      });
  }

  ngOnDestroy(): void {
    if (this.logisticObservableSubscription) {
      this.logisticObservableSubscription.unsubscribe();
    }
  }

  async getProduct(nfe: any) {
    try {
      this.productsNfe = []; // Limpar o array antes de adicionar novos produtos
      for (let i = 0; i < nfe.merchandise.length; i++) {
        await this.productService
          .getProductById(nfe.merchandise[i])
          .subscribe((product: Product) => {
            this.productsNfe.push(product);
          });
      }
    } catch (error) {
      console.error("Details error", error);
    }
  }
}
