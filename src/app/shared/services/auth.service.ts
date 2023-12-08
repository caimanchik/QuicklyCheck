import { Injectable } from '@angular/core';
import {BehaviorSubject, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  public isLogged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public login() {
    this.isLogged$.next(true)
    return of(true)
  }
}
