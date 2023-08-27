import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectId } from 'mongodb';
import { Observable, map } from 'rxjs';
import { Logistic } from 'src/app/core/interfaces/logistic.interface';

var httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class LogisticService {
  constructor(private http: HttpClient) {
    fetch('http://localhost:3000/logistics', {
      method: 'GET',
    })
      .then((response) => {})
      .catch((error) => {});
  }

  url = 'http://localhost:3000/';
  urlOnline = 'https://nodejs-api-logistica.onrender.com';
  logistic = {} as Logistic;

  /**
   * 
   * @returns All logistics
   */
  getAllLogistcs = async (): Promise<Observable<Logistic[]>> => {
    return this.http.get<Logistic[]>(this.url + 'logistics');
  };

  /**
   * 
   * @returns Delivered Logistic array
   */
  getAllDeliveredLogistics(): Observable<Logistic[]> {

    return this.http
      .get<Logistic[]>(this.url + 'logistics')
      .pipe(
        map((logistics: Logistic[]) =>
          logistics.filter((log: Logistic) => log.status === 'delivered')
        )
      );
  }

  // getLogistcById(Logistcid: string): Observable<Logistic> {
  //   const apiurl = `${this.url}/${Logistcid}`;
  //   return this.http.get<Logistc>(apiurl);
  // }

  // createLogistc(Logistc: Logistic): Observable<Logistic> {
  //   return this.http.post<Logistic>(this.url, Logistc, httpOptions);
  // }

  updateLogistc(Logistcid: ObjectId, Logistc: Logistic): Observable<Logistic> {
    console.log("Checking 2")

    const apiurl = `${this.url}logistics/${Logistcid}`;
    return this.http.put<Logistic>(apiurl, Logistc, httpOptions);
  }

  // deleteLogistcById(Logisticid: string): Observable<number> {
  //   const apiurl = `${this.url}/${Logisticid}`;
  //   return this.http.delete<number>(apiurl, httpOptions);
  // }
}
