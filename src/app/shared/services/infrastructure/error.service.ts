import { ErrorHandler, Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ErrorService implements ErrorHandler {

  public error$: Subject<string> = new Subject<string>()

  constructor(
    private _router: Router
  ) { }

  public createError(error: string): void {
    this.error$.next(error)
  }

  public handleError(error: any): void {
    if (error instanceof HttpErrorResponse && error.status == 401) {
      return
    }

    this.createError('Неизвестная ошибка')
  }

  public passErrorWithMessage(message: string, redirectPath: any[] = ["error"], withRedirect = true) {
    return <T>(origin: Observable<T>) =>
      origin.pipe(
        catchError(e => {
          if (message)
            this.createError(message)

          if (withRedirect)
            this._router.navigate(redirectPath)

          return throwError(() => e)
        })
      )
  }
}
