import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckComponent {

  constructor() { }
}
