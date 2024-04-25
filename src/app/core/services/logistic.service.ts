import { HttpHeaders } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Logistic } from "src/app/core/interfaces/logistic.interface";
import { environment } from "../../../environments/environment";

var httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class LogisticService {
  constructor(private http: HttpClient) {}

  url = environment.apiUrl;
  logistic = {} as Logistic;

  /**
   *
   * @returns All logistics
   */
  getAllLogistics(filterByDelivered?: boolean): Observable<Logistic[]> {
    return this.http.get<Logistic[]>(this.url + "logistics").pipe(
      map((logistics: Logistic[]) => {
        if (filterByDelivered) {
          return logistics.filter((log: Logistic) => log.status === "delivered");
        }
        return logistics.filter((log: Logistic) => log.status !== "delivered");
      })
    );
  }

  updateLogistic(logistic: Logistic): Observable<Logistic> {
    const apiurl = `${this.url}logistics/${logistic._id}`;
    return this.http.put<Logistic>(apiurl, logistic, httpOptions);
  }

  createLogistic(logistic: Logistic): Observable<Logistic> {
    return this.http.post<Logistic>(`${this.url}logistics/`, logistic, httpOptions);
  }
}
