import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProductService } from "src/app/core/services/product.service";
import { Product } from "src/app/core/interfaces/product.interface";
import { ActivatedRoute } from "@angular/router";
import { Logistic } from "src/app/core/interfaces/logistic.interface";
import { DataShareService } from "./../../core/services/data-share.service";
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { isEqual } from "../../core/utils/objects";
import { LogisticService } from "src/app/core/services/logistic.service";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.less"]
})
export class DetailsComponent implements OnInit, OnDestroy {
  product = {} as Product;
  products: Product[] = [];
  productsNfe: Product[] = [];

  logistic = {} as Logistic;
  logistics: Logistic[] = [];

  datesFormated: any = {};
  editing = false;

  private logisticObservableSubscription: Subscription = new Subscription();
  detailsForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private dataShareService: DataShareService,
    private fb: FormBuilder,
    private logisticService: LogisticService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.logisticObservableSubscription = this.dataShareService
      .getDataObservable()
      .subscribe((newLogistic: Logistic) => {
        this.logistic = newLogistic;
        this.getProduct(this.logistic);
        this.formatLogisticsDates();
        this.setInitialFormValues();
      });

    this.createForm();
  }

  formatLogisticsDates() {
    this.datesFormated = {
      pin_release: new Date(this.logistic.pin_release).toISOString().split("T")[0],
      date_out: new Date(this.logistic.date_out).toISOString().split("T")[0],
      arrival_forecast: new Date(this.logistic.arrival_forecast).toISOString().split("T")[0]
    };
  }

  createForm() {
    this.detailsForm = this.fb.group({
      pinRelease: [""],
      dateOut: [Validators.required],
      arrivalForecast: []
    });
  }

  setInitialFormValues() {
    this.detailsForm.get("pinRelease")?.setValue(this.datesFormated.pin_release);
    this.detailsForm.get("dateOut")?.setValue(this.datesFormated.date_out);
    this.detailsForm.get("arrivalForecast")?.setValue(this.datesFormated.arrival_forecast);
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
        await this.productService.getProductById(nfe.merchandise[i]).subscribe((product: Product) => {
          this.productsNfe.push(product);
        });
      }
    } catch (error) {
      console.error("Details error", error);
    }
  }

  editField() {
    this.editing = !this.editing;
  }

  onSubmit() {
    const currentFormValues = {
      pin_release: this.detailsForm.get("pinRelease")?.value,
      date_out: this.detailsForm.get("dateOut")?.value,
      arrival_forecast: this.detailsForm.get("arrivalForecast")?.value
    };

    if (this.detailsForm.valid && !isEqual(this.datesFormated, currentFormValues)) {
      const logisticTosave = this.logistic;
      logisticTosave.pin_release = new Date(currentFormValues.pin_release).toLocaleDateString();
      logisticTosave.date_out = new Date(currentFormValues.date_out);
      logisticTosave.arrival_forecast = new Date(currentFormValues.arrival_forecast).toString();

      // Save changes or update data
      this.logisticService.updateLogistic(logisticTosave).subscribe(e => {
        console.log(e);
        this.toastr.success("Dados atualizados", "Sucesso!");
      });
      this.editing = !this.editing;
    } else {
      // Handle invalid form
      console.log("Invalid form");
    }
  }
}
