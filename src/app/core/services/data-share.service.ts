import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Logistic } from 'src/app/core/interfaces/logistic.interface';

@Injectable({
  providedIn: 'root',
})
export class DataShareService {
  private logisticSubject = new Subject<Logistic>();
  logistic$: Observable<Logistic> = this.logisticSubject.asObservable();
 
  private data: any;

  constructor() {}
  // Working with any data type.
  setData(data: any): void {
    this.data = data;
  }

  getData(): any {
    return this.data;
  }

  // Working with Logistic data type.
  setDataLogistic(logistic: Logistic) {
    this.logisticSubject.next(logistic);
  }

  getDataObservable(): Observable<Logistic> {
    return this.logistic$;
  }

}
