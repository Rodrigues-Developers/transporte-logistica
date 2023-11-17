import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import * as xml2js from "xml2js";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.less"]
})
export class RegistrationComponent implements OnInit {
  show: string | undefined;
  xmlData: any;
  nfHeader: any;
  nfeProc: any;
  ide: any;
  cUF: any;
  cNF: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  /**
   * Receive the XML file
   * @function inputFileChange
   * @param event
   */
  inputFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      const xml = event.target.files[0];
      const a = 2;

      const reader = new FileReader();

      reader.onload = e => {
        const xmlContent = e.target ? (e.target.result as string) : "";
        this.parseXml(xmlContent);
      };

      reader.readAsText(xml);
    }
  }

  parseXml(xml: string) {
    //xml2js method
    const parser = new xml2js.Parser({ strict: false, trim: true });
    parser.parseString(xml, (err, result) => {
      this.nfHeader = result;
      
    });
      this.nfeProc = this.findKey(this.nfHeader, "NFEPROC");
      this.ide = this.findKey(this.nfHeader, "IDE");
      this.cUF = this.findKey(this.nfHeader, "CUF");
      this.cNF = this.findKey(this.nfHeader, "CNF");

    
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
