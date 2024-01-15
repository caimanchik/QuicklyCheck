import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private _httpClient: HttpClient,
    private _router: Router
  ) { }

  public Get<TGet>(
    uri: string,
    options: {
      headers?: HttpHeaders,
      params?: HttpParams,
      withCredentials?: boolean;
    } = {withCredentials: true}
  ): Observable<TGet> {
    return this._httpClient.get<TGet>(environment.backendUrl + /api/ + uri, {
      ...options,
      observe: 'response'
    }).pipe(
      catchError(e => this.handleError.bind(this)(e)),
      map(r => r.body as TGet)
    )
  }

  public Post<TPost, TGet>(
    uri: string,
    data: TPost,
    options: {
      headers?: HttpHeaders,
      params?: HttpParams,
      withCredentials?: boolean;
    } = {withCredentials: true},
    handleAuth = true
  ): Observable<TGet> {
    return this._httpClient.post<TGet>(environment.backendUrl + /api/ + uri, data, {
      ...options,
      observe: 'response'
    }).pipe(
      catchError(e => this.handleError.bind(this)(e)),
      map(r => r.body as TGet)
    )
  }

  public Put<TPost, TGet>(
    uri: string,
    data: TPost,
    options: {
      headers?: HttpHeaders,
      params?: HttpParams,
      withCredentials?: boolean;
    } = {withCredentials: true},
    handleAuth = true
  ): Observable<TGet> {
    return this._httpClient.put<TGet>(environment.backendUrl + /api/ + uri, data, {
      ...options,
      observe: 'response'
    }).pipe(
      catchError(e => this.handleError.bind(this)(e)),
      map(r => r.body as TGet)
    )
  }

  public Delete<TGet>(
    uri: string,
    options: {
      headers?: HttpHeaders,
      params?: HttpParams,
      withCredentials?: boolean;
    } = {withCredentials: true},
    handleAuth = true
  ): Observable<TGet> {
    return this._httpClient.delete<TGet>(environment.backendUrl + /api/ + uri, {
      ...options,
      observe: 'response'
    }).pipe(
      catchError(e => this.handleError.bind(this)(e)),
      map(r => r.body as TGet)
    )
  }

  private handleError(e: HttpErrorResponse) {
    if (e.status === 401 && !e.url?.includes("token")) {
      this._router.navigate(['login'])
    }

    return throwError(() => e)
  }
}
