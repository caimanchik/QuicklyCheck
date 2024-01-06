import { ErrorHandler, Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ErrorService implements ErrorHandler {

  public error$: Subject<string> = new Subject<string>()

  constructor() { }

  public createError(error: string): void {
    this.error$.next(error)
  }

  public handleError(error: any): void {
    if (error instanceof HttpErrorResponse && error.status === 401) {
      return
    }

    this.createError('Неизвестная ошибка')
  }
}
