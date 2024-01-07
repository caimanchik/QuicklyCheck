import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CheckService } from "../../../../../shared/services/check.service";
import { take } from "rxjs";

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultComponent implements OnInit {

  constructor(
    private _checkService: CheckService
  ) { }

  public ngOnInit(): void {
    this._checkService.checkBlanks()
      .pipe(take(1))
      .subscribe(console.log)
  }

}
