import { LogisticService } from "src/app/core/services/logistic.service";
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

  constructor(private http: HttpClient, private logisticService: LogisticService) {}
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
    const nfeId = new ObjectId();
    const receiverId = new ObjectId(); //TODO Verify if receiver has create on database.
    const supplierId = new ObjectId(); //TODO Verify if receiver has create on database.
    const transporterId = new ObjectId(); //TODO Verify if receiver has create on database.

    var emit = this.findKey(this.xmlData, "EMIT");
    var dest = this.findKey(this.xmlData, "DEST");
    var transp = this.findKey(this.xmlData, "TRANSP");

    this.logistic._id = nfeId;
    this.logistic.nfe = this.findKey(this.xmlData, "NNF");
    this.logistic.operation = this.findKey(this.xmlData, "NATOP");
    this.logistic.emission_date = this.findKey(this.xmlData, "DHEMI");
    this.logistic.supplier = supplierId;
    this.logistic.receiver = receiverId;
    this.logistic.transporter = transporterId;
    this.logistic.freight = this.findKey(this.xmlData, "VFRETE");
    this.logistic.discount = this.findKey(this.xmlData, "VDESC");
    this.logistic.total_product_value = this.findKey(this.xmlData, "VPROD");
    this.logistic.total_note_value = this.findKey(this.xmlData, "VNF");
    this.logistic.bulk = this.findKey(transp, "QVOL");
    this.logistic.shipping_on_account = this.findKey(transp, "MODFRETE");
    this.logistic.merchandise = [];

    this.supplier._id = supplierId;
    this.supplier.cnpj = this.findKey(emit, "CNPJ");
    this.supplier.name = this.findKey(emit, "XNOME");
    this.supplier.uf = this.findKey(emit, "UF");
    this.supplier.type = "supplier";

    this.receiver._id = receiverId;
    this.receiver.cnpj = this.findKey(dest, "CNPJ");
    this.receiver.name = this.findKey(dest, "XNOME");
    this.receiver.uf = this.findKey(dest, "UF");
    this.receiver.type = "receiver";

    this.transporter._id = transporterId;
    this.transporter.cnpj = "transporterId";
    this.transporter.name = this.findKey(transp, "XNOME");
    this.transporter.uf = "ZZ";
    this.transporter.type = "transporter";

    const arrayProduct = this.findKey(this.xmlData, "DET");

    arrayProduct.forEach((prod: any) => {
      const productId = new ObjectId();

      const newProduct = {
        _id: productId,
        factory_code: this.findKey(prod, "CPROD"),
        description: this.findKey(prod, "XPROD"),
        amount: this.findKey(prod, "QCOM"),
        price: this.findKey(prod, "VUNCOM"),
        total_price: this.findKey(prod, "VPROD")
      } as Product;

      this.products.push(newProduct);
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

  async saveLogistic() {
    this.products.forEach(prod => {
      if (prod._id) {
        console.log("Demonstrativo merchandise -->  ", this.logistic.merchandise);
        this.logistic.merchandise.push(prod._id);
      }
    });

    try {
      await this.logisticService.createLogistic(this.logistic).subscribe(
        (resultado) => {
          console.log('Logistic criado:', resultado);
        },
        (erro) => {
          console.error('Erro ao criar logistic:', erro);
        });
    } catch (error) {
      console.error("Details error", error);
    }
  }
}
