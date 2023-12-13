import { Component, ElementRef, Input, OnInit, Output, QueryList, ViewChildren } from "@angular/core";
import { DataShareService } from "./../../core/services/data-share.service";
import { Product } from "../../core/interfaces/product.interface";
import { Logistic } from "../../core/interfaces/logistic.interface";
import { LogisticService } from "src/app/core/services/logistic.service";
import { ProductService } from "src/app/core/services/product.service";
import { ObjectId } from "mongodb";
import { Subscription } from "rxjs";
import { EventEmitter } from "@angular/core";
import { AnimationBuilder, animate, style } from "@angular/animations";

@Component({
  selector: "app-transport-detail-table",
  templateUrl: "./transport-detail-table.component.html",
  styleUrls: ["./transport-detail-table.component.less"]
})
export class TransportDetailTableComponent implements OnInit {
  @ViewChildren("checkBoxes") checkBoxes!: QueryList<ElementRef>;

  @Output() logisticsSelected: EventEmitter<Logistic[]> = new EventEmitter<Logistic[]>();
  @Input() delivered: boolean = false;

  product = {} as Product;
  products: Product[] = [];

  logistic = {} as Logistic;
  logistics: Logistic[] = [];
  selectedLogistics: Logistic[] = [];
  productServiceObservable: Subscription = new Subscription();
  checkedLogisticsElements: HTMLElement[] = [];

  details = "sidebar";
  background = "hide_background";

  checkAll: boolean = false;

  constructor(
    private productService: ProductService,
    private logisticService: LogisticService,
    private dataShareService: DataShareService,
    private animationBuilder: AnimationBuilder
  ) {}

  ngOnInit(): void {
    this.getLogistics();
  }

  @Input()
  set updateTable(update: boolean) {
    for (let i = 0; i < this.checkedLogisticsElements.length; i++) {
      if (this.selectedLogistics[i].status === "delivered") {
        this.setAnimation(this.checkedLogisticsElements[i]);
      }
    }
  }

  /**
   * Get all delivered logistics from data base
   */
  async getLogistics() {
    this.logisticService.getAllLogistics(this.delivered).subscribe((logistics: Logistic[]) => {
      this.logistics = logistics;
    });
  }

  /**
   * Get all products from database.
   */
  async getProducts() {
    this.productServiceObservable = (await this.productService.getAllProducts()).subscribe((products: Product[]) => {
      this.products = products;
    });
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
    this.details = "sidebar_details";
    this.background = "show_background";

    const data = logis; // Data to be sent
    this.dataShareService.setDataLogistic(data);
  }

  closeSidebar() {
    this.details = "sidebar";
    this.background = "hide_background";
  }

  /**
   *
   * Include or remove in array selected or unselected item
   * @param {Logistic} logis
   */
  toggleSelection(logis: Logistic, event: Event): void {
    const currentElement = event.currentTarget as HTMLElement;

    if (this.isSelected(logis)) {
      this.selectedLogistics = this.selectedLogistics.filter(selected => selected !== logis);
      this.checkedLogisticsElements = this.checkedLogisticsElements.filter(selected => selected !== currentElement);
    } else {
      this.selectedLogistics.push(logis);
      this.checkedLogisticsElements.push(currentElement);
    }
    this.onSelectionChange();
  }

  /**
   *
   * @param {Logistic} logis
   * @returns verification if is selected
   */
  isSelected(logis: Logistic): boolean {
    return this.selectedLogistics.includes(logis);
  }

  toggleAllCheckboxes(): void {
    this.checkAll = !this.checkAll;
    const checkboxes = this.checkBoxes.toArray();
    for (const checkbox of checkboxes) {
      const input = checkbox.nativeElement as HTMLInputElement;
      if (input.checked !== this.checkAll) {
        input.click();
      }
    }
  }

  setAnimation(element: HTMLElement): void {
    const metadata = [
      animate("2s ease-in-out", style({ transform: "translateX(100%)", opacity: 0 })) // Transition for fadeOutRight
    ];

    const factory = this.animationBuilder.build(metadata);
    const player = factory.create(element.parentElement?.parentElement); // Get the <tr> element

    player.play();

    player.onDone(() => {
      this.getLogistics();
    });
  }

  onSelectionChange(): void {
    // Emit the selectedLogistics array to the parent component
    this.logisticsSelected.emit(this.selectedLogistics);
  }

  ngOndestroy(): void {
    this.productServiceObservable.unsubscribe();
  }
}
