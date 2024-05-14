import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class PopupStateService {
  private openSubject = new Subject<boolean>();
  popState$: Observable<boolean> = this.openSubject.asObservable();

  constructor() {}

  getDataObservable(): Observable<boolean> {
    return this.popState$;
  }

  setDataLogistic(popState: boolean) {
    this.openSubject.next(popState);
  }
}
