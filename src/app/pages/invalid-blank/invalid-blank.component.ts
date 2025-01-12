import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-invalid-blank',
  templateUrl: './invalid-blank.component.html',
  styleUrls: ['./invalid-blank.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvalidBlankComponent {
}
