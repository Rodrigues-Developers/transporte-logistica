import { CompanyService } from "src/app/core/services/company.service";
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
import { Company } from "src/app/core/interfaces/company.interface";

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
  company = {} as Company;
  logistics: Logistic[] = [];
  companies: Company[] = [];
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
    private animationBuilder: AnimationBuilder,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.getLogistics();
    this.getCompanies();
  }

  @Input()
  set updateTable(update: boolean) {
    let refreshTable = true;
    const moveLeft = true;
    for (let i = 0; i < this.checkedLogisticsElements.length; i++) {
      refreshTable = i + 1 === this.checkedLogisticsElements.length;
      if (this.selectedLogistics[i].status === "Entregue") {
        this.setAnimation(this.checkedLogisticsElements[i], !moveLeft, refreshTable);
      } else if (this.delivered) {
        this.setAnimation(this.checkedLogisticsElements[i], moveLeft, refreshTable);
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
   * @name getCompanies()
   * @description Get all companies on database.
   */
  async getCompanies() {
    this.companyService.getAllCompany().subscribe((companies: Company[]) => {
      this.companies = companies;
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

  getTransporter(transportId: ObjectId) {
    const transporter = this.companies.find(transp => transp._id == transportId);
    return transporter!.name;
  }
  getTransporterColor(transportId: ObjectId) {
    const transporter = this.companies.find(transp => transp._id == transportId);
    return transporter!.color;
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

  setAnimation(element: HTMLElement, moveLeft: boolean, refreshTable: boolean): void {
    const metadata = [
      animate("2s ease-in-out", style({ transform: moveLeft ? "translateX(-100%)" : "translateX(100%)", opacity: 0 })) // Transition for fadeOutRight
    ];

    const factory = this.animationBuilder.build(metadata);
    const player = factory.create(element.parentElement?.parentElement); // Get the <tr> element

    player.play();

    player.onDone(() => {
      if (refreshTable) this.getLogistics();
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
      if (!arrivalForecastDate) {
        logi.status = "Atualize a previsão de chegada.";
      } else if (logi.status !== "Entregue") {
        if (arrivalForecastDate >= currentDate) {
          logi.status = "Em dia.";
          this.logisticService.updateLogistic(logi);
        } else if (arrivalForecastDate < currentDate) {
          logi.status = "Atrasada";
          this.logisticService.updateLogistic(logi);
        }
      }
    });
  }

  groupLogisByDate() {
    const logisticsGroup: GroupedLogistics[] = [];
    const emptyArrivalList: Logistic[] = [];
    let logisticsTemp: Logistic[] = [];

    // Separating logistics with blank arrival_forecast date
    for (const logistic of this.logistics) {
      if (!logistic.arrival_forecast) {
        emptyArrivalList.push(logistic);
      } else {
        logisticsTemp.push(logistic);
      }
    }

    // Sort logistics
    logisticsTemp.sort((a, b) => {
      if (!a.arrival_forecast || !b.arrival_forecast) {
        return 0; // One of them are undefined or null, maintain the original order
      } else {
        return new Date(a.arrival_forecast).getTime() - new Date(b.arrival_forecast).getTime();
      }
    });

    for (const logis of logisticsTemp) {
      //Get inital and final days of the week
      const currentDate = new Date(logis.arrival_forecast ?? "");
      const initialDate = new Date(currentDate);
      const finalDate = new Date(currentDate);

      const mondayNumber = currentDate.getDate() - currentDate.getDay();
      const saturdayNumber = mondayNumber + 5;

      //Set Date types to the correct days
      initialDate.setDate(mondayNumber);
      finalDate.setDate(saturdayNumber);

      //Look for the initialDate in the logisticsGroup
      const weekIndex = logisticsGroup.findIndex(log => initialDate <= log.initial);

      //If the group exists
      if (weekIndex !== -1) {
        if (initialDate.getTime() === logisticsGroup[weekIndex].initial.getTime()) {
          logisticsGroup[weekIndex].logistics.push(logis);
        } else {
          // create a new week group on the correct position
          logisticsGroup.splice(weekIndex, 0, {
            initial: initialDate,
            final: finalDate,
            logistics: [logis]
          });
        }
      } else {
        logisticsGroup.push({
          initial: initialDate,
          final: finalDate,
          logistics: [logis]
        });
      }
    }

    const today = new Date();
    logisticsGroup.push({
      initial: today,
      final: today,
      logistics: emptyArrivalList
    });

    return logisticsGroup;
  }

  ngOnDestroy(): void {
    this.productServiceObservable.unsubscribe();
  }
}
