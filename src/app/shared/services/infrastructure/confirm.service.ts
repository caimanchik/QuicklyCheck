import { Injectable } from '@angular/core';
import { Observable, Subject, take } from "rxjs";
import { ConfirmAsk } from "../../interfaces/Confirm/ConfirmAsk";

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  confirmMessages: Subject<ConfirmAsk> = new Subject<ConfirmAsk>()
  confirmResult: Subject<boolean> = new Subject<boolean>()

  constructor() { }

  createConfirm(ask: ConfirmAsk): Observable<boolean> {
    this.confirmMessages.next(ask)
    return this.confirmResult
      .pipe(take(1))
  }
}
