import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";
import { TestService } from "../../../../../shared/services/test.service";
import { ActivatedRoute } from "@angular/router";
import { take } from "rxjs";

@Component({
  selector: 'app-test-fill',
  templateUrl: './test-fill.component.html',
  styleUrls: ['./test-fill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter',
        useAnimation(transformOpacity), {
          params: {
            oStart: 0,
            oEnd: 1,
            transformStart: "translateY(10px)",
            transformEnd: "translateY(0px)",
          }
        }),
    ])
  ]
})
export class TestFillComponent implements OnInit {

  constructor(
    private _test: TestService,
    private _route: ActivatedRoute
  ) { }

  public ngOnInit(): void {
    this._test.getPatterns(+(this._route.snapshot.paramMap.get('id') ?? 0))
      .pipe(take(1))
      .subscribe(e => console.log(e))
  }

}
