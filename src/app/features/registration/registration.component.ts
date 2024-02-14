import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import * as xml2js from "xml2js";

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
  receiver: any;
  ufReceiver: any;
  cnpjReceiver: any;
  freightValue: any;
  discount: any;
  totalProdValue: any;
  totalNf: any;
  conveyor: any;
  packages: any;
  freightPaidBy: any;
  products: any[] = [];

  constructor(private http: HttpClient) {}
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

    var emit = this.findKey(this.xmlData, "EMIT");
    var dest = this.findKey(this.xmlData, "DEST");
    var transp = this.findKey(this.xmlData, "TRANSP");

    this.nfNumber = this.findKey(this.xmlData, "NNF");
    this.nature = this.findKey(this.xmlData, "NATOP");
    this.issueDate = this.findKey(this.xmlData, "DHEMI");
    this.provider = this.findKey(emit, "XNOME");
    this.ufProvider = this.findKey(emit, "UF");
    this.cnpjProvider = this.findKey(emit, "CNPJ");
    this.receiver = this.findKey(dest, "XNOME");
    this.ufReceiver = this.findKey(dest, "UF");
    this.cnpjReceiver = this.findKey(dest, "CNPJ");
    this.conveyor = this.findKey(transp, "XNOME");
    this.packages = this.findKey(transp, "QVOL");
    this.freightPaidBy = this.findKey(transp, "MODFRETE");
    this.freightValue = this.findKey(this.xmlData, "VFRETE");
    this.discount = this.findKey(this.xmlData, "VDESC");
    this.totalProdValue = this.findKey(this.xmlData, "VPROD");
    this.totalNf = this.findKey(this.xmlData, "VNF");
    this.products = this.findKey(this.xmlData, "DET");
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

  // async receive() {
  //   for (const logis of this.receivedLogistics) {
  //     if (logis._id) {
  //       try {
  //         const updatedLogistic: Logistic = logis;
  //         logis.status = "delivered";
  //         this.logisticService.updateLogistic(updatedLogistic).subscribe(() => this.refreshTransportTable());
  //       } catch (error) {
  //         console.error(`Error updating logistics ${logis._id}: ${error}`);
  //       }
  //     }
  //   }
  // }
}
