import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { AuthService } from "../../services/auth.service";
import { AuthToken } from "../../../app.module";
import { opacityIn } from "../../animations/opacityIn";
import { opacityOut } from "../../animations/opacityOut";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(opacityIn)),
      transition(':leave', useAnimation(opacityOut))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {

  constructor(
    @Inject(AuthToken) protected auth: AuthService,
  ) { }
}
