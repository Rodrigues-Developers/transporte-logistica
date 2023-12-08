import { GroupedProducts, Product } from "../../core/interfaces/product.interface";
import { Component, OnInit, ElementRef, Renderer2, AfterViewInit, ViewChildren, QueryList } from "@angular/core";
import { Logistic } from "../../core/interfaces/logistic.interface";
import { ProductService } from "src/app/core/services/product.service";
import { LogisticService } from "src/app/core/services/logistic.service";
import { ObjectId } from "mongodb";
import { objectValuesToArray } from "src/app/core/utils/objects";
import { AnimationBuilder, animate, style } from "@angular/animations";
@Component({
  selector: "app-products-tracking",
  templateUrl: "./products-tracking.component.html",
  styleUrls: ["./products-tracking.component.less"]
})
export class ProductsTrackingComponent implements OnInit, AfterViewInit {
  @ViewChildren("productCards") productCards!: QueryList<ElementRef>;
  cardStates: { [key: string]: string } = {};
  product = {} as Product;
  products: Product[] = [];

  logistic = {} as Logistic;
  logistics: Logistic[] = [];

  productsArray = [] as any[];

  runningCardAnimation = false;
  constructor(
    private productService: ProductService,
    private logisticService: LogisticService,
    private renderer: Renderer2,
    private animationBuilder: AnimationBuilder
  ) {}

  ngOnInit(): void {
    this.getProducts();
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

  setProdCardPosition(card: ElementRef<any>) {
    const productsCard = card.nativeElement.children;
    let index = 0;
    for (const product of productsCard) {
      this.renderer.setStyle(product, "height", 100 - index * 10 + "%");
      index++;
    }
  }

  setAnimation(event: Event, cardIndex: number): void {
    if (!this.runningCardAnimation) {
      this.runningCardAnimation = true;

      const element = event.currentTarget as HTMLElement;
      if (element.children.length > 1) {
        const metadata = [
          animate("0.6s ease-in-out", style({ transform: "translateY(100%)", opacity: 0 })) // Transition for fadeDown
        ];

        const factory = this.animationBuilder.build(metadata);
        const player = factory.create(element.lastElementChild);

        player.play();

        player.onDone(() => {
          const metadata2 = [
            style({ transform: "translateY(-100%)" }), // Move to top
            animate("0.6s ease-in-out", style({ transform: "translateY(0)", opacity: 1 })) // Transition for fadeUpDown
          ];

          const factory2 = this.animationBuilder.build(metadata2);
          const player2 = factory2.create(element.lastElementChild);
          player2.play();

          const card = this.productCards.toArray()[cardIndex];
          const lastChild = card.nativeElement.lastElementChild;
          const firstChild = card.nativeElement.firstElementChild;

          card.nativeElement.insertBefore(lastChild, firstChild);
          this.setProdCardPosition(card);

          player2.onDone(() => {
            this.runningCardAnimation = false;
          });
        });
      }
    }
  }
}
