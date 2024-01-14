import { ChangeDetectionStrategy, Component } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { opacity } from "../../animations/opacity";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  animations: [
    trigger('appear', [
      transition(':enter',
        useAnimation(opacity), {
          params: {
            oStart: 0,
            oEnd: 1,
          }
        }),
      transition(':leave',
        useAnimation(opacity), {
          params: {
            oStart: 1,
            oEnd: 0,
          }
        })
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {

  constructor(
    protected auth: AuthService
  ) { }
}
