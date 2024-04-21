import { Component, ElementRef, Input, OnInit, Output, QueryList, ViewChildren } from "@angular/core";
import { DataShareService } from "./../../core/services/data-share.service";
import { Product } from "../../core/interfaces/product.interface";
import { GroupedLogistics, Logistic } from "../../core/interfaces/logistic.interface";
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

  logisticsGroups: Logistic[] = [];
  groupedLogistics: GroupedLogistics[] = [];
  displayedGroupedLogistics: GroupedLogistics[] = [];
  initialItemsToDisplay = 3; // Number of items to display initially
  itemsToLoad = 1; // Number of items to load when user scrolls to the bottom
  loadingData = true;

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
      } else if (this.delivered) {
        this.setAnimation(this.checkedLogisticsElements[i], true);
      }
    }
  }

  onScroll(): void {
    if (this.isScrolledToBottom()) {
      this.loadMoreLogistics();
    }
  }

  isScrolledToBottom(): boolean {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const bodyHeight = document.body.scrollHeight;

    return scrollPosition > bodyHeight - windowHeight - 20; // Add some buffer to trigger earlier
  }

  loadMoreLogistics(): void {
    this.initialItemsToDisplay += this.itemsToLoad;

    // Update the displayedGroupedLogistics array with more items
    this.displayedGroupedLogistics = this.groupedLogistics.slice(0, this.initialItemsToDisplay);
  }

  /**
   * Get all delivered logistics from data base
   */
  async getLogistics() {
    this.logisticService.getAllLogistics(this.delivered).subscribe((logistics: Logistic[]) => {
      this.logistics = logistics;
      this.groupedLogistics = this.groupLogisByDate();
      this.loadMoreLogistics();
      this.loadingData = false;

      this.updateStatus();
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

  setAnimation(element: HTMLElement, moveLeft?: boolean): void {
    const metadata = [
      animate("2s ease-in-out", style({ transform: moveLeft ? "translateX(-100%)" : "translateX(100%)", opacity: 0 })) // Transition for fadeOutRight
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

  /**
   * @function
   * @name updateStatus
   * @description this function updates the status according to the arrival time and current date.
   */
  updateStatus() {
    const currentDate = new Date();

    this.logistics.forEach(logi => {
      const arrivalForecastDate = logi.arrival_forecast ? new Date(logi.arrival_forecast) : undefined;

      if (arrivalForecastDate) {
        if (arrivalForecastDate >= currentDate) {
          logi.status = "Em dia.";
          this.logisticService.updateLogistic(logi);
        } else if (arrivalForecastDate < currentDate) {
          logi.status = "Atrasada";
          this.logisticService.updateLogistic(logi);
        }
      } else {
        logi.status = "Atualize a previsão de chegada.";
      }
    });
  }

  groupLogisByDate() {
    const groupedLogistics: GroupedLogistics[] = [];
    const updateDataGroup: Logistic[] = [];
    // Sort logistics
    this.logistics.sort((a, b) => {
      if (!a.arrival_forecast || !b.arrival_forecast) {
        return 0; // One of them are undefined or null, maintain the original order
      } else {
        return new Date(a.arrival_forecast).getTime() - new Date(b.arrival_forecast).getTime();
      }
    });

    // Separating logistics with blank arrival_forecast date
    for (const logistic of this.logistics) {
      if (!logistic.arrival_forecast) {
        updateDataGroup.push(logistic);
      }
    }

    // Removing logistics with blank arrival_forecast date from the main array
    this.logistics = this.logistics.filter(logistic => logistic.arrival_forecast);

    //Get last logistic with a validate arrival_forecast date
    let lastIndex = 1;
    while (lastIndex <= this.logistics.length && !this.logistics[this.logistics.length - lastIndex].arrival_forecast) {
      lastIndex++;
    }

    const initialDate = new Date(this.logistics[0].arrival_forecast ?? "");
    const endDate = new Date(this.logistics[this.logistics.length - lastIndex].arrival_forecast ?? "");

    let currentIniDay = new Date(initialDate);
    let currentFinDay = new Date(initialDate);

    let initialDateNumber = initialDate.getDate() - initialDate.getDay();
    let finalDateNumber = initialDateNumber + 6;

    let j = 0;
    while (currentFinDay <= endDate) {
      finalDateNumber = initialDateNumber + 6;

      currentIniDay.setDate(initialDateNumber);
      currentFinDay.setDate(finalDateNumber);

      let tempGroup: Logistic[] = [];

      while (j < this.logistics.length) {
        const currentLogisDate = new Date(this.logistics[j].arrival_forecast ?? "");
        if (currentLogisDate < currentFinDay || !this.logistics[j].arrival_forecast) {
          tempGroup.push(this.logistics[j]);
        } else {
          break;
        }
        j++;
      }

      groupedLogistics.push({
        initial: new Date(currentIniDay),
        final: new Date(currentFinDay),
        logistics: tempGroup
      });

      // Go to next week
      initialDateNumber = currentFinDay.getDate() + 1;
    }

    // Adding the group for logistics with blank arrival_forecast date
    if (updateDataGroup.length > 0) {
      const date = new Date();
      groupedLogistics.push({
        initial: date,
        final: date,
        logistics: updateDataGroup
      });
    }

    groupedLogistics.sort((a, b) => a.initial.getTime() - b.initial.getTime());
    return groupedLogistics;
  }

  ngOnDestroy(): void {
    this.productServiceObservable.unsubscribe();
  }
}
