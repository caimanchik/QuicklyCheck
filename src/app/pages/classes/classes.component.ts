import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClassesComponent {
  constructor() { }
}
