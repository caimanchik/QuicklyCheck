import { Injectable } from '@angular/core';
import { BehaviorSubject, throttleTime } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private scrollY = new BehaviorSubject(0);
  public scrollY$ = this.scrollY.asObservable()
    .pipe(
      throttleTime(50)
    );
  public scrollHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
  constructor(
  ) { }

  public nextScrollPos(value: number) {
    this.scrollY.next(value)
  }
}
