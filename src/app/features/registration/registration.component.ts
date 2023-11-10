import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import * as xml2js from "xml2js";
import * as $ from "jquery";

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

  ngOnInit() {
    
  }

  /** 
   * Receive the XML file
   * @function inputFileChange
   * @param event 
   */
  inputFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      const xml = event.target.files[0];

      const reader = new FileReader();

      reader.onload = (e) => {
        const xmlContent = e.target ? e.target.result as string : "";
        this.parseXml(xmlContent);
      };

      reader.readAsText(xml);
    }
  }

  parseXml(xml: string) {
    const xmlDoc = $.parseXML(xml);
    const $xml = $(xmlDoc);

    this.ide = $xml.find("nNF").text();
    console.log("cNF: " + this.cNF);

  }
}
