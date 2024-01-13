import { Injectable } from '@angular/core';
import { Observable, Subject, take } from "rxjs";
import { IConfirmAsk } from "../../interfaces/Confirm/IConfirmAsk";

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  confirmMessages: Subject<IConfirmAsk> = new Subject<IConfirmAsk>()
  confirmResult: Subject<boolean> = new Subject<boolean>()

  constructor() { }

  createConfirm(ask: IConfirmAsk): Observable<boolean> {
    this.confirmMessages.next(ask)
    return this.confirmResult
      .pipe(take(1))
  }
}
