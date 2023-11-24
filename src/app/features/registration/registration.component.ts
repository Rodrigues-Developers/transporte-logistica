import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
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
  provider: any;
  nature: any;
  receiver: any;
  cUF: any;
  cNF: any;

  constructor(private http: HttpClient) {}

  /**
   * Receive the XML file
   * @function inputFileChange
   * @param event
   */
  inputFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      const xml = event.target.files[0];

      const reader = new FileReader();

      reader.onload = e => {
        const xmlContent = e.target ? (e.target.result as string) : "";
        this.parseXml(xmlContent);
      };

      reader.readAsText(xml);
    }
  }

  parseXml(xml: string) {
    const parser = new xml2js.Parser({ strict: false, trim: true });
    parser.parseString(xml, (err, result) => {
      this.xmlData = result;
    });

    this.nfNumber = this.findKey(this.xmlData, "NNF");
    this.provider = this.findKey(this.xmlData, "XNOME");
    this.nature = this.findKey(this.xmlData, "NATOP");
    var emit = this.findKey(this.xmlData, "DEST");
    this.receiver = this.findKey(emit, "XNOME");
    // this.receiver = this.findKey(this.xmlData, "CNF");
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
}
