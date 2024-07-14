import { LogisticService } from "src/app/core/services/logistic.service";
import { ProductService } from "src/app/core/services/product.service";
import { CompanyService } from "src/app/core/services/company.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Logistic } from "src/app/core/interfaces/logistic.interface";
import * as xml2js from "xml2js";
import { Company } from "src/app/core/interfaces/company.interface";
import { Product } from "src/app/core/interfaces/product.interface";
import { ToastrService } from "ngx-toastr";
import { ColorPickerModule } from "ngx-color-picker";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-registration",
  imports: [ColorPickerModule, CommonModule],
  standalone: true,
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.less"]
})
export class RegistrationComponent implements OnInit {
  color: string = "#127dbc";
  xmlData: any;

  logistic = {} as Logistic;
  logistics: Logistic[] = [];

  products: Product[] = [];

  companies: Company[] = [];

  supplier = {} as Company;
  receiver = {} as Company;
  transporter = {} as Company;

  loadingData = false;

  constructor(
    private http: HttpClient,
    private logisticService: LogisticService,
    private productsService: ProductService,
    private companyService: CompanyService,
    private toastr: ToastrService
  ) {}
  @ViewChild("inputContainer") inputContainerRef!: ElementRef;

  ngOnInit(): void {
    this.getLogistics();
    this.getCompanies();
  }

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

    var emit = this.findKey(this.xmlData, "EMIT");
    var dest = this.findKey(this.xmlData, "DEST");
    var transp = this.findKey(this.xmlData, "TRANSP");

    this.logistic._id = nfeId;
    this.logistic.nfe = this.toArrayIfNeeded(this.findKey(this.xmlData, "NNF"));
    this.logistic.key = this.toArrayIfNeeded(this.findKey(this.xmlData, "ID"));
    this.logistic.operation = this.toArrayIfNeeded(this.findKey(this.xmlData, "NATOP"));
    this.logistic.emission_date = this.toArrayIfNeeded(this.findKey(this.xmlData, "DHEMI"));
    this.logistic.freight = this.toArrayIfNeeded(this.findKey(this.xmlData, "VFRETE"));
    this.logistic.discount = this.toArrayIfNeeded(this.findKey(this.xmlData, "VDESC"));
    this.logistic.total_product_value = this.toArrayIfNeeded(this.findKey(this.xmlData, "VPROD"));
    this.logistic.total_note_value = this.toArrayIfNeeded(this.findKey(this.xmlData, "VNF"));
    this.logistic.bulk = this.toArrayIfNeeded(this.findKey(transp, "QVOL"));
    this.logistic.shipping_on_account = this.toArrayIfNeeded(this.findKey(transp, "MODFRETE"));
    this.logistic.merchandise = [];

    /**
     * @description Verify if suplier exist on database.
     */
    const suplierCnpj = this.toArrayIfNeeded(this.findKey(emit, "CNPJ"));
    const foundSuplier = this.companies.find(company => company.cnpj === suplierCnpj);
    if (foundSuplier) {
      this.logistic.supplier = foundSuplier._id;
      this.supplier = foundSuplier;
    } else {
      const supplierId = new ObjectId();
      this.supplier._id = supplierId;
      this.logistic.supplier = supplierId;
      this.supplier.cnpj = suplierCnpj;
      this.supplier.name = this.toArrayIfNeeded(this.findKey(emit, "XNOME"));
      this.supplier.uf = this.toArrayIfNeeded(this.findKey(emit, "UF"));
      this.supplier.type = "supplier";
    }

    /**
     * @description Verify if receiver exist on database.
     */
    const receiverCnpj = this.toArrayIfNeeded(this.findKey(dest, "CNPJ"));
    const foundReceiver = this.companies.find(company => company.cnpj === receiverCnpj);
    if (foundReceiver) {
      this.logistic.receiver = foundReceiver._id;
      this.receiver = foundReceiver;
    } else {
      const receiverId = new ObjectId();
      this.logistic.receiver = receiverId;
      this.receiver._id = receiverId;
      this.receiver.cnpj = receiverCnpj;
      this.receiver.name = this.toArrayIfNeeded(this.findKey(dest, "XNOME"));
      this.receiver.uf = this.toArrayIfNeeded(this.findKey(dest, "UF"));
      this.receiver.color = ""; //TODO: Create a layout to select a color.
      this.receiver.type = "receiver";
    }

    /**
     * @description Verify if transporter exist on database.
     */
    const transporterCnpj = this.toArrayIfNeeded(this.findKey(transp, "CNPJ"));
    const foundTransporter = this.companies.find(company => company.cnpj === transporterCnpj);
    if (foundTransporter) {
      this.logistic.transporter = foundTransporter._id;
      this.transporter = foundTransporter;
    } else {
      const transporterId = new ObjectId();
      this.transporter._id = transporterId;
      this.transporter.cnpj = transporterCnpj;
      this.transporter.name = this.toArrayIfNeeded(this.findKey(transp, "XNOME"));
      this.transporter.uf = this.toArrayIfNeeded(this.findKey(transp, "UF"));
      this.transporter.type = "transporter";
      this.logistic.transporter = transporterId;
    }

    /**
     * @description Implements the products
     */
    const arrayProduct = this.findKey(this.xmlData, "DET");
    arrayProduct.forEach((prod: any) => {
      //TODO: Verify if product exist on database.
      const factCode = this.toArrayIfNeeded(this.findKey(prod, "CPROD"));
      // const product = this.products.find(product => product.factory_code === factCode);
      const productId = new ObjectId();
      const newProduct = {
        _id: productId,
        factory_code: this.toArrayIfNeeded(this.findKey(prod, "CPROD")),
        nfeRef: new Array({
          nfeId: nfeId,
          amount: this.toArrayIfNeeded(this.findKey(prod, "QCOM"))
        }),
        description: this.toArrayIfNeeded(this.findKey(prod, "XPROD")),
        price: this.toArrayIfNeeded(this.findKey(prod, "VUNCOM")),
        total_price: this.toArrayIfNeeded(this.findKey(prod, "VPROD"))
      } as Product;
      this.products.push(newProduct);
      this.logistic.merchandise.push(productId);
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

  /**
   * @name saveLogistic
   * @description Save a new Logistic
   */
  async saveLogistic() {
    try {
      this.logisticService.createLogistic(this.logistic).subscribe(result => {
        console.log("Logistic criado: ", result);
        this.toastr.success("Nota Salva", "Sucesso!");
        this.clearPage();
      });
    } catch (error) {
      console.error("Creation error: ", error);
      this.toastr.error("Não foi possivel salvar a nota!", "Falha!");
    }
  }

  async saveCompany(company: Company) {
    try {
      this.companyService.createCompany(company).subscribe(result => {
        console.log("Company criado: ", result);
        this.toastr.success("Empresa Salva", "Sucesso!");
        this.clearPage();
      });
    } catch (error) {
      console.error("Creation error: ", error);
      this.toastr.error("Não foi possível salvar a empresa!", "Falha!");
    }
  }

  async saveProducts() {
    for (const product of this.products) {
      try {
        this.productsService.createProduct(product).subscribe(result => {
          console.log("Products criado: ", result);
          
        });
      } catch (error: any) {
        if (error.code === 11000) {
          console.error("### Error 11000 ###");
        }
        console.error("Erro ao criar products: ", error);
      }
    }
  }

  /**
   * @name saveRegistration
   * @description Call functions saveLogistic(), saveProducts() and verify if
   */
  async saveRegistration() {
    this.loadingData = true;
    const verifyl = this.logistics.some(log => log.key === this.logistic.key);

    if (!verifyl) {
      this.saveLogistic();
      this.saveProducts();
      this.saveCompany(this.transporter); //TODO Perguntar cor quando salvar pela primeira vêz.
      this.saveCompany(this.supplier);
      this.saveCompany(this.receiver);
    } else {
      console.log("A nota fiscal que esta tentando salvar já existe no banco de dados");
      this.toastr.error("A nota fiscal já foi salva!", "Falha!");
      this.clearPage();
    }
  }

  async getLogistics() {
    this.logisticService.getAllLogistics().subscribe((logistics: Logistic[]) => {
      this.logistics = logistics;
    });
  }

  async getCompanies() {
    this.companyService.getAllCompany().subscribe((companies: Company[]) => {
      this.companies = companies;
    });
  }

  clearPage() {
    this.xmlData = false;
    this.logistic = {} as Logistic;

    this.products = [];

    this.supplier = {} as Company;
    this.receiver = {} as Company;
    this.transporter = {} as Company;

    this.loadingData = false;
    this.getLogistics();
  }
}
