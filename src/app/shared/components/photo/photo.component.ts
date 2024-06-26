import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { appear } from "../../animations/appear";


@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ],
})
export class PhotoComponent {
  @Input() public previews!: string[]

  @Output() public uploadEvent = new EventEmitter<FileList>()
  @Output() public checkEvent = new EventEmitter<void>()
  @Output() public backEvent = new EventEmitter<void>()
  @Output() public deleteEvent = new EventEmitter<number>()

  @ViewChild("photoInput", {read: ElementRef}) private photoInput!: ElementRef

  constructor() { }

  protected uploadImages($event: Event) {
    // @ts-ignore
    this.uploadEvent.next($event.target.files)
  }

  protected clickInput() {
    this.photoInput.nativeElement.click();
  }

  protected generateCheckEvent() {
    this.checkEvent.next()
  }

  protected deletePhoto(i: number) {
    this.deleteEvent.next(i)
  }

  protected backClicked() {
    this.backEvent.next()
  }
}
