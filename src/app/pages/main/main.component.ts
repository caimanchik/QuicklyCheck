import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild, ViewChildren } from "@angular/core";
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../shared/animations/transform-opacity";
import { opacity } from "../../shared/animations/opacity";
import { AuthService } from "../../shared/services/auth.service";
import { take } from "rxjs";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
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
export class MainComponent implements AfterViewInit {
  @ViewChildren('slide', {read: ElementRef}) private _slides!: ElementRef[]
  @ViewChildren('number', {read: ElementRef}) private _numbers!: ElementRef[]
  @ViewChild('progressGreyBar', {read: ElementRef}) private _progressGreyBar!: ElementRef

  private _currentSlide = 1

  constructor(
    protected _auth: AuthService
  ) { }

  public ngAfterViewInit(): void {
    this._auth.isLogged$
      .pipe(take(1))
      .subscribe(r => {
        if (!r)
          this.initSlide(0)
      })

  }

  protected initSlide(slide: number): void {
    this._currentSlide = slide

    this._slides.forEach((e, i) => {
      if (i === slide)
        e.nativeElement.classList.add('active')
      else
        e.nativeElement.classList.remove('active')
    })

    this._numbers.forEach((e, i) => {
      if (i <= slide)
        e.nativeElement.classList.add('active')
      else
        e.nativeElement.classList.remove('active')
    })

    for (let i = 0; i < 5; i++)
      if (i === slide)
        this._progressGreyBar.nativeElement.classList.add(`active${i + 1}`)
      else
        this._progressGreyBar.nativeElement.classList.remove(`active${i + 1}`)
  }

  protected moveNextSlide() {
    if (this._currentSlide + 1 < 5)
      this.initSlide(this._currentSlide + 1)
  }

  protected movePrevSlide() {
    if (this._currentSlide - 1 >= 0)
      this.initSlide(this._currentSlide - 1)
  }
}
