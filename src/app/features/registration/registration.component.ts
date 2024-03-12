import { LogisticService } from "src/app/core/services/logistic.service";
import { ProductService } from "src/app/core/services/product.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// import { ObjectId } from "mongodb";
import { Logistic } from "src/app/core/interfaces/logistic.interface";
import * as xml2js from "xml2js";
import { Company } from "src/app/core/interfaces/company.interface";
import { Product } from "src/app/core/interfaces/product.interface";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.less"]
})
export class RegistrationComponent {
  show: string | undefined;
  xmlData: any;
  nfNumber: any;
  nature: any;
  issueDate: any;
  provider: any;
  ufProvider: any;
  cnpjProvider: any;
  ufReceiver: any;
  cnpjReceiver: any;
  freightValue: any;
  discount: any;
  totalProdValue: any;
  totalNf: any;
  conveyor: any;
  packages: any;
  freightPaidBy: any;

  logistic = {} as Logistic;
  logistics: Logistic[] = [];

  products: Product[] = [];

  supplier = {} as Company;
  receiver = {} as Company;
  transporter = {} as Company;

  constructor(
    private http: HttpClient,
    private logisticService: LogisticService,
    private productsService: ProductService
  ) {}
  @ViewChild("inputContainer") inputContainerRef!: ElementRef;

  onDragOver(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.inputContainerRef.nativeElement.classList.add("input-container--over");
  }

  onDragLeave(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.inputContainerRef.nativeElement.classList.remove("input-container--over");
  }

  onFileChangeOrDrop(event: any): void {
    event.preventDefault();
    event.stopPropagation();

    const files: File[] = event.type === "change" ? event.target.files : event.dataTransfer?.files || [];

    if (files.length > 0) {
      const file = files[0];

      const reader = new FileReader();

      reader.onload = e => {
        const fileContent = e.target ? (e.target.result as string) : "";
        this.parseXml(fileContent);
      };

      reader.readAsText(file);
    }
  }

  parseXml(xml: string) {
    const parser = new xml2js.Parser({ strict: false, trim: true });
    parser.parseString(xml, (err, result) => {
      this.xmlData = result;
    });

    const { ObjectId } = require("bson");
    // produsctsIds: Array<ObjectId> ;

    const nfeId = new ObjectId();
    const receiverId = new ObjectId(); //TODO Verify if receiver has create on database.
    const supplierId = new ObjectId(); //TODO Verify if receiver has create on database.
    const transporterId = new ObjectId(); //TODO Verify if receiver has create on database.

    var emit = this.findKey(this.xmlData, "EMIT");
    var dest = this.findKey(this.xmlData, "DEST");
    var transp = this.findKey(this.xmlData, "TRANSP");

    this.logistic._id = nfeId;
    this.logistic.nfe = this.toArrayIfNeeded(this.findKey(this.xmlData, "NNF"));
    this.logistic.operation = this.toArrayIfNeeded(this.findKey(this.xmlData, "NATOP"));
    this.logistic.emission_date = this.toArrayIfNeeded(this.findKey(this.xmlData, "DHEMI"));
    this.logistic.supplier = supplierId;
    this.logistic.receiver = receiverId;
    this.logistic.transporter = transporterId;
    this.logistic.freight = this.toArrayIfNeeded(this.findKey(this.xmlData, "VFRETE"));
    this.logistic.discount = this.toArrayIfNeeded(this.findKey(this.xmlData, "VDESC"));
    this.logistic.total_product_value = this.toArrayIfNeeded(this.findKey(this.xmlData, "VPROD"));
    this.logistic.total_note_value = this.toArrayIfNeeded(this.findKey(this.xmlData, "VNF"));
    this.logistic.bulk = this.toArrayIfNeeded(this.findKey(transp, "QVOL"));
    this.logistic.shipping_on_account = this.toArrayIfNeeded(this.findKey(transp, "MODFRETE"));
    this.logistic.merchandise = [];

    this.supplier._id = supplierId;
    this.supplier.cnpj = this.findKey(emit, "CNPJ");
    this.supplier.name = this.findKey(emit, "XNOME");
    this.supplier.uf = this.findKey(emit, "UF");
    this.supplier.type = "supplier";

    this.receiver._id = receiverId;
    this.receiver.cnpj = this.toArrayIfNeeded(this.findKey(dest, "CNPJ"));
    this.receiver.name = this.toArrayIfNeeded(this.findKey(dest, "XNOME"));
    this.receiver.uf = this.toArrayIfNeeded(this.findKey(dest, "UF"));
    this.receiver.type = "receiver";

    this.transporter._id = transporterId;
    this.transporter.cnpj = "transporterId";
    this.transporter.name = this.toArrayIfNeeded(this.findKey(transp, "XNOME"));
    this.transporter.uf = "ZZ";
    this.transporter.type = "transporter";

    const arrayProduct = this.findKey(this.xmlData, "DET");

    arrayProduct.forEach((prod: any) => {
      const productId = new ObjectId();

      const newProduct = {
        _id: productId,
        factory_code: this.toArrayIfNeeded(this.findKey(prod, "CPROD")),
        description: this.toArrayIfNeeded(this.findKey(prod, "XPROD")),
        amount: this.toArrayIfNeeded(this.findKey(prod, "QCOM")),
        price: this.toArrayIfNeeded(this.findKey(prod, "VUNCOM")),
        total_price: this.toArrayIfNeeded(this.findKey(prod, "VPROD"))
      } as Product;

      this.products.push(newProduct);

      this.logistic.merchandise.push(productId);
      console.log("Aqui está logistic merchandise:  ", this.logistic.merchandise);
    });
  }

  /**
   * findKey function, find a key in a json object
   * @param object
   * @param keyWanted
   * @returns
   */
  findKey(object: Record<string, any>, keyWanted: String): any {
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        if (key === keyWanted) {
          return object[key];
        } else if (typeof object[key] === "object") {
          const result = this.findKey(object[key], keyWanted);
          if (result !== undefined) {
            return result;
          }
        }
      }
    }
    return undefined;
  }

  toArrayIfNeeded(value: any) {
    if (Array.isArray(value)) {
      return value[0];
    }
    return value;
  }

  async saveLogistic() {
    try {
      await this.logisticService.createLogistic(this.logistic).subscribe(
        result => {
          console.log("Logistic criado: ", result);
        },
        error => {
          console.error("Erro ao criar logistic: ", error);
        }
      );
    } catch (error) {
      console.error("Details error", error);
    }
  }

  async saveProducts() {
    for (const product of this.products) {
      try {
        const result = await this.productsService.createProduct(product).toPromise();
        console.log("Products criado: ", result);
      } catch (error) {
        console.error("Erro ao criar products: ", error);
      }
    }
  }
  

  async saveCompany() {}

}
