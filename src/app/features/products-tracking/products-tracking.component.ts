import { GroupedProducts, Product } from "../../core/interfaces/product.interface";
import { Component, OnInit, ElementRef, Renderer2, AfterViewInit, ViewChildren, QueryList } from "@angular/core";
import { Logistic } from "../../core/interfaces/logistic.interface";
import { ProductService } from "src/app/core/services/product.service";
import { LogisticService } from "src/app/core/services/logistic.service";
import { ObjectId } from "mongodb";
import { objectValuesToArray } from "src/app/core/utils/objects";
import { animate, state, style, transition, trigger } from "@angular/animations";
@Component({
  selector: "app-products-tracking",
  templateUrl: "./products-tracking.component.html",
  styleUrls: ["./products-tracking.component.less"],
  animations: [
    trigger("cardAnimation", [
      state("moveDown", style({ transform: "translateY(100%)", opacity: 0 })),
      transition("* => moveDown", animate("0.6s ease-in-out"))
    ])
  ]
})
export class ProductsTrackingComponent implements OnInit, AfterViewInit {
  @ViewChildren("productCards") productCards!: QueryList<ElementRef>;
  cardStates: { [key: string]: string } = {};
  product = {} as Product;
  products: Product[] = [];

  logistic = {} as Logistic;
  logistics: Logistic[] = [];

  details = "sidebar";

  exitFunc = false;
  productsArray = [] as any[];
  constructor(
    private productService: ProductService,
    private logisticService: LogisticService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.details = "sidebar";
  }

  ngAfterViewInit() {
    this.productCards.changes.subscribe(prodCards => {
      this.placeProductsOnTop(prodCards);
    });
  }
  //Get all products from database.
  async getProducts() {
    (await this.productService.getAllProducts()).subscribe((products: Product[]) => {
      this.products = products;
      if (this.exitFunc === false) {
        this.exitFunc = true;

        for (let index = 0; index < 3; index++) {
          let prod = JSON.parse(JSON.stringify(this.products[index]));
          let newProd = prod;
          newProd.factory_code = index;
          this.products.push(newProd);
        }
        for (let index = 0; index < 1; index++) {
          let prod = JSON.parse(JSON.stringify(this.products[index]));
          let newProd = prod;
          newProd.factory_code = index;
          this.products.push(newProd);
        }
        for (let index = 0; index < 2; index++) {
          let prod = JSON.parse(JSON.stringify(this.products[index]));
          let newProd = prod;
          newProd.factory_code = index;
          this.products.push(newProd);
        }
        for (let index = 0; index < 7; index++) {
          let prod = JSON.parse(JSON.stringify(this.products[index]));
          let newProd = prod;
          newProd.factory_code = index;
          this.products.push(newProd);
        }
        for (let index = 0; index < 7; index++) {
          let prod = JSON.parse(JSON.stringify(this.products[index]));
          let newProd = prod;
          newProd.factory_code = index;
          this.products.push(newProd);
        }
      }
      this.groupProductsByCode();
    });
  }
  getProduct(id: ObjectId) {
    this.productService.getProductById(id).subscribe((product: Product) => {
      this.product = product;
    });
  }

  groupProductsByCode() {
    const allProducts = this.products;
    const groupedProducts = allProducts.reduce((acc, currentItem) => {
      if (!acc[currentItem.factory_code]) {
        acc[currentItem.factory_code] = [];
      }
      acc[currentItem.factory_code].push(currentItem);
      return acc;
    }, {} as GroupedProducts);

    this.productsArray = objectValuesToArray(groupedProducts);
    console.log(groupedProducts);
  }

  placeProductsOnTop(prodCards: ElementRef<any>[]) {
    for (const card of prodCards) {
      let index = 0;
      for (const product of card.nativeElement.children) {
        this.renderer.setStyle(product, "height", 100 - index * 10 + "%");
        index++;
      }
    }
  }

  callSidebar() {
    this.details = "sidebar_details";
  }

  swapCards(cardIndex: number) {
    console.log("Animation started");
    this.cardStates[cardIndex] = "moveDown";
  }
  onAnimationEnd(event: any, cardIndex: number) {
    console.log("Animation ended", event);
    if (event.toState === "moveDown") {
      // After the moveDown animation ends, swap the firstChild with the lastChild
      const card = this.productCards.toArray()[cardIndex];
      const lastChild = card.nativeElement.lastElementChild;
      const firstChild = card.nativeElement.firstElementChild;

      card.nativeElement.insertBefore(lastChild, firstChild);
      //Reset cards state
      this.cardStates[cardIndex] = "";
    }
  }
}
