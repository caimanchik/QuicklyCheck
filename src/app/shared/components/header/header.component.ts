import { transition, trigger, useAnimation } from "@angular/animations";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from "@angular/core";
import { opacity } from "../../animations/opacity";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { AuthToken } from "../../../app.module";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
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
