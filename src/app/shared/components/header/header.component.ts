import { transition, trigger, useAnimation } from "@angular/animations";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { AuthToken } from "../../../app.module";
import { opacityIn } from "../../animations/opacityIn";
import { opacityOut } from "../../animations/opacityOut";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('animation', [
      transition(':enter', useAnimation(opacityIn)),
      transition(':leave', useAnimation(opacityOut))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  protected navOpened = false

  constructor(
    @Inject(AuthToken) protected auth: AuthService,
    private _router: Router,
    private _cd: ChangeDetectorRef
  ) { }

  protected toggleNav() {
    const body = document.querySelector('body')
    if (body?.classList.contains('lock'))
      body?.classList.remove('lock')
    else
      body?.classList.add('lock')

    this._cd.markForCheck()
    this.navOpened = !this.navOpened
  }

  protected navigate(url: string) {
    if (this.navOpened)
      this.toggleNav()

    this._router.navigate([url])
  }
}
