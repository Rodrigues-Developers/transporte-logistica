import { Component, OnInit, OnDestroy, AfterViewChecked } from "@angular/core";
import { ProductService } from "src/app/core/services/product.service";
import { Product } from "src/app/core/interfaces/product.interface";
import { ActivatedRoute } from "@angular/router";
import { Logistic, UserNote } from "src/app/core/interfaces/logistic.interface";
import { DataShareService } from "./../../core/services/data-share.service";
import { Observable, Subscription, of } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { isEqual } from "../../core/utils/objects";
import { LogisticService } from "src/app/core/services/logistic.service";
import { ToastrService } from "ngx-toastr";
import { stringToDate } from "src/app/core/utils/dates";
import { ObjectId } from "mongodb";
@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.less"]
})
export class DetailsComponent implements OnInit, OnDestroy, AfterViewChecked {
  product = {} as Product;
  products: Product[] = [];
  productsNfe: Product[] = [];

  logistic = {} as Logistic;
  logistics: Logistic[] = [];

  datesFormated: any = {};
  editing = false;
  currentDate: Date = new Date();
  showArea = false;
  editingNote = false;

  private logisticObservableSubscription: Subscription = new Subscription();
  detailsForm!: FormGroup;
  observationForm!: FormGroup;
  currentAreaIndex!: number;
  currentNote!: UserNote;

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

  ngAfterViewChecked() {
    if (this.editingNote) {
      const selectedTextArea = document.getElementById("textarea_" + this.currentAreaIndex) as HTMLTextAreaElement;
      selectedTextArea.value = this.currentNote.note;
    }
  }

  formatLogisticsDates() {
    this.datesFormated = {
      pin_release: this.logistic.pin_release?.toISOString().split("T")[0],
      date_out: this.logistic.date_out?.toISOString().split("T")[0],
      arrival_forecast: this.logistic.arrival_forecast?.toISOString().split("T")[0]
    };
  }

  createForm() {
    this.detailsForm = this.fb.group({
      pinRelease: [""],
      dateOut: [Validators.required],
      arrivalForecast: []
    });

    this.observationForm = this.fb.group({
      userNote: ["", Validators.required]
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
      this.productsNfe = []; // Clear array before adding new products
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

  toggleNewNote() {
    this.showArea = !this.showArea;
  }

  updateNote(note: UserNote, TextAreaIndex: number) {
    this.editingNote = !this.editingNote;

    if (this.currentNote === note && !this.editingNote) {
      //Get current logistic
      const logisticTosave = this.logistic;
      if (logisticTosave.note) {
        //Update the note value

        for (let originalNote of logisticTosave.note) {
          if (originalNote._id === note._id) {
            const noteElement = document.getElementById("textarea_" + this.currentAreaIndex) as HTMLTextAreaElement;

            // if the note is the same then exit the function
            if (originalNote.note === noteElement.value) return;

            originalNote.note = noteElement.value;
            break;
          }
        }
      }
      try {
        //Call the PUT method to update logistic
        this.logisticService.updateLogistic(logisticTosave).subscribe(e => {
          this.toastr.success("Nota atualizada", "Sucesso!");
        });
      } catch (error) {
        this.toastr.error("Não foi possível atualizar a nota", "Falha!");
      }
    }

    //Update the note and text area selected
    this.currentNote = note;
    this.currentAreaIndex = TextAreaIndex;
  }

  deleteNote(noteID: ObjectId | undefined) {
    //Get current logistic
    const logisticTosave = this.logistic;
    //Filter deleted note
    logisticTosave.note = this.logistic.note?.filter((note: UserNote) => note._id != noteID);
    try {
      //Update logistic
      this.logisticService.updateLogistic(logisticTosave).subscribe(e => {
        this.toastr.success("Nota removida", "Sucesso!");
      });
    } catch (error) {
      this.toastr.error("Não foi possível remover a nota", "Falha!");
    }
  }

  onSubmit() {
    const currentFormValues = {
      pin_release: this.detailsForm.get("pinRelease")?.value,
      date_out: this.detailsForm.get("dateOut")?.value,
      arrival_forecast: this.detailsForm.get("arrivalForecast")?.value
    };

    if (this.detailsForm.valid && !isEqual(this.datesFormated, currentFormValues)) {
      const logisticTosave = this.logistic;

      logisticTosave.pin_release = stringToDate(currentFormValues.pin_release);
      logisticTosave.date_out = stringToDate(currentFormValues.date_out);
      logisticTosave.arrival_forecast = stringToDate(currentFormValues.arrival_forecast);

      // Save changes or update data
      this.logisticService.updateLogistic(logisticTosave).subscribe(e => {
        this.toastr.success("Dados atualizados", "Sucesso!");
      });
      this.editing = !this.editing;
    } else {
      // Handle invalid form
      this.toastr.error("Não foi possível salvar as informações", "Falha!");
    }
  }

  onObsSubmit() {
    if (this.observationForm.valid) {
      //Get form Values
      const currentFormValues = {
        userNote: this.observationForm.get("userNote")?.value
      };

      //Get current logistic
      const logisticTosave = this.logistic;

      // Update and save data
      const userNote: UserNote = {
        date: new Date(),
        note: currentFormValues.userNote
      };

      logisticTosave.note?.push(userNote);
      this.observationForm.get("userNote")?.setValue(""); //Clear text area
      this.logisticService.updateLogistic(logisticTosave).subscribe(e => {
        this.toastr.success("Nota adicionada", "Sucesso!");
      });
    } else {
      // Handle invalid form
      this.toastr.error("Não foi possível adicionar a nota", "Falha!");
    }
  }
}
