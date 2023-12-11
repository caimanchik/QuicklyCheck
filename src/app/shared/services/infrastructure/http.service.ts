import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  public Get<TGet>(
    uri: string,
    options: {
      headers?: HttpHeaders,
      params?: HttpParams,
      withCredentials?: boolean;
    } = {withCredentials: true}
  ): Observable<TGet> {
    if (options.withCredentials) {
      options.headers = options.headers?.append('Authorization', `Bearer`) ?? new HttpHeaders({
        'Authorization': `Bearer`
      })
    }

    return this._httpClient.get<TGet>(environment.backendUrl + uri, {
      ...options,
      observe: 'response'
    }).pipe(
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
    if (options.withCredentials) {
      options.headers = options.headers?.append('Authorization', `Bearer`) ?? new HttpHeaders({
        'Authorization': `Bearer`
      })
    }

    return this._httpClient.post<TGet>(environment.backendUrl + uri, data, {
      ...options,
      observe: 'response'
    }).pipe(
      map(r => r.body as TGet)
    )
      // .pipe(
      //   catchError(e => this.handleError.bind(this)(e))
      // )
  }
}
