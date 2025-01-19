import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DestroyService } from "../../services/infrastructure/destroy.service";
import { IBreadCrumbItem } from "../../interfaces/Application/IBreadCrumbItem";
import { Router } from "@angular/router";

@Component({
  selector: 'app-bread-crumbs',
  templateUrl: './bread-crumbs.component.html',
  styleUrls: ['./bread-crumbs.component.scss'],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadCrumbsComponent {
  @Input() public crumbs: IBreadCrumbItem[] = []
  @Input() public center = false

  constructor(
    private readonly _router: Router
  ) {
  }

  protected crumbClicked($event: MouseEvent, crumb: IBreadCrumbItem) {
    $event.preventDefault()
    this._router.navigate(crumb.link)
  }
}
