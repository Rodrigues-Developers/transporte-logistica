import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { Company } from "src/app/core/interfaces/company.interface";
import { environment } from "../../../environments/environment";

var httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class CompanyService {
  constructor(private http: HttpClient) {}

  url = environment.apiUrl;
  company = {} as Company;

  /**
   * @name getAllCompany
   * @description Get all company filtered by type.
   * @param type
   * @returns All Company filtered by type
   */
  getAllCompany(): Observable<Company[]> {
    return this.http.get<Company[]>(this.url + "company");
  }

  createCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(`${this.url}company`, company, httpOptions);
  }
}
