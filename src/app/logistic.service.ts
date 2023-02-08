import { HttpHeaders } from '@angular/common/http';
import { Logistic } from './interfaces/logistic.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  getAllLogistcs(): Observable<Logistic[]> {
    return this.http.get<Logistic[]>(this.url+"logistics")
  }

  // getLogistcById(Logistcid: string): Observable<Logistic> {
  //   const apiurl = `${this.url}/${Logistcid}`;
  //   return this.http.get<Logistc>(apiurl);
  // }

  // createLogistc(Logistc: Logistic): Observable<Logistic> {
  //   return this.http.post<Logistic>(this.url, Logistc, httpOptions);
  // }

  // updateLogistc(Logistcid: string, Logistc: Logistic): Observable<Logistic> {
  //   const apiurl = `${this.url}/${Logistcid}`;
  //   return this.http.put<Logistic>(apiurl, Logistc, httpOptions);
  // }

  // deleteLogistcById(Logisticid: string): Observable<number> {
  //   const apiurl = `${this.url}/${Logisticid}`;
  //   return this.http.delete<number>(apiurl, httpOptions);
  // }
}
