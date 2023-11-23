import { Component, Renderer2, ElementRef, ViewChild } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"]
})
export class AppComponent {
  @ViewChild("navbarMenu") navbarMenu!: ElementRef;
  title = "transporte-logistica";
  showMenuClass = "";
  showMenu = false;
  private isTimeoutInProgress: boolean = false;

  constructor(private renderer: Renderer2) {}

  showNavMenu() {
    if (this.isTimeoutInProgress) {
      return; // Exit the function if timeout is in progress
    }
    this.showMenu = !this.showMenu;
    const navbarMenuElement = this.navbarMenu.nativeElement;
    if (this.showMenu) {
      this.renderer.removeClass(navbarMenuElement, "slide-from-left");
      this.renderer.addClass(navbarMenuElement, "slide-from-right");
      this.isTimeoutInProgress = true;
      setTimeout(() => {
        this.renderer.addClass(navbarMenuElement, "transition");
        this.isTimeoutInProgress = false;
      }, 800);
    } else {
      this.renderer.removeClass(navbarMenuElement, "transition");
      this.renderer.removeClass(navbarMenuElement, "slide-from-right");
      this.renderer.addClass(navbarMenuElement, "slide-from-left");
      this.isTimeoutInProgress = true;

      setTimeout(() => {
        this.renderer.removeClass(navbarMenuElement, "slide-from-left");
        this.isTimeoutInProgress = false;
      }, 800);
    }
  }

  closeMenu() {
    this.showMenu = false;
    const navbarMenuElement = this.navbarMenu.nativeElement;
    this.renderer.addClass(navbarMenuElement, "transition");
    this.renderer.addClass(navbarMenuElement, "slide-from-left");
    this.renderer.removeClass(navbarMenuElement, "slide-from-right");
    setTimeout(() => {
      this.renderer.removeClass(navbarMenuElement, "transition");
      this.renderer.removeClass(navbarMenuElement, "slide-from-left");
    }, 500);
  }
}
