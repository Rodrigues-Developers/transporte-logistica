import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { AnimationBuilder, animate, style } from "@angular/animations";
import { PopupStateService } from "src/app/core/services/popup-state.service";

@Component({
  selector: "app-popup",
  templateUrl: "./popup.component.html",
  styleUrls: ["./popup.component.less"]
})
export class PopupComponent {
  private _isVisible: boolean = false;
  player: any;
  isVisible: boolean = false;

  // @Input()
  // set isVisible(value: boolean) {
  //   this._isVisible = value;

  //   if (this.popUpElement) {
  //     this.setAnimation(this.popUpElement.nativeElement as HTMLElement, this._isVisible);
  //   }
  // }

  // get isVisible(): boolean {
  //   return this._isVisible;
  // }

  @Output() isVisibleEmitter = new EventEmitter<boolean>();
  @Output() confirmEmitter = new EventEmitter<boolean>();

  @ViewChild("popUpElement", { static: false }) popUpElement!: ElementRef;

  constructor(private animationBuilder: AnimationBuilder, private popupStateService: PopupStateService) {
    this.popupStateService.getDataObservable().subscribe((popState: boolean) => {
      this.isVisible = popState;
      if (this.popUpElement) {
        this.setAnimation(this.popUpElement.nativeElement as HTMLElement, this._isVisible);
      }
    });
  }

  close() {
    this._isVisible = false;
    this.isVisibleEmitter.emit(this._isVisible);
  }

  confirm() {
    this.confirmEmitter.emit(true);
  }

  back() {
    this.confirmEmitter.emit(false);
  }

  setAnimation(element: HTMLElement, isVisble: boolean): void {
    // Checks if the animation is running
    if (this.player?.getPosition() < 1) {
      this.player.reset();
    }

    const opacityValue = isVisble ? 1 : 0;

    const metadata = [animate("0.4s ease-in-out", style({ opacity: opacityValue }))];

    const factory = this.animationBuilder.build(metadata);
    this.player = factory.create(element);
    this.player.play();

    this.player.onDone(() => {
      if (!isVisble) {
        this.close();
      }
    });
  }
}
