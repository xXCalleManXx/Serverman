import {Directive, ElementRef, HostListener, Input, OnDestroy} from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnDestroy {

  private marginTop = 5;
  private className = 'app-tooltip kt-shape-font-color-4 kt-shape-bg-color-1';
  private id;

  @Input() tooltipContent: string;

  constructor(
    private elementRef: ElementRef<HTMLElement>
  ) { }

  randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  protected createTooltipId(): string {
    let rand = this.randomIntFromInterval(1000, 9999);
    let id = 'app-tooltip-' + rand;

    while (document.querySelectorAll(`#${id}`).length !== 0) {
      rand = this.randomIntFromInterval(1000, 9999);
      id = 'app-tooltip-' + rand;
    }

    return id;
  }

  protected initTooltip() {
    if (!this.id) {
      this.id = this.createTooltipId();
    }

    if (document.querySelectorAll(`#${this.id}`).length > 0) {
      return
    }
    const dom = document.createElement('div');
    dom.id = this.id;
    dom.className = 'app-tooltip';
    document.body.append(dom);
  }

  protected get tooltipElement(): HTMLElement {
    return document.querySelector(`#${this.id}`);
  }

  protected getCoordinatedOfElement() {
    const viewportOffset = this.elementRef.nativeElement.getBoundingClientRect();
    return {
      top: viewportOffset.top,
      left: viewportOffset.left
    }
  }

  protected selfWidth() {
    return this.tooltipElement.offsetWidth;
  }

  protected getHeightOfElement() {
    return this.elementRef.nativeElement.offsetHeight;
  }

  protected getWidthOfElement() {
    return this.elementRef.nativeElement.offsetWidth;
  }

  @HostListener('mouseenter')
  mouseEnterEvent() {
    this.initTooltip();

    this.tooltipElement.innerHTML = this.tooltipContent || '';
    setTimeout(() => {
      if (!this.tooltipElement) {
        return;
      }
      this.tooltipElement.className = this.className + ' active';
    }, 5)
    const {top,left} = this.getCoordinatedOfElement();
    const height = this.getHeightOfElement();
    this.tooltipElement.style.left = (left - (this.selfWidth() / 2) + (this.getWidthOfElement() / 2)) + 'px';
    this.tooltipElement.style.top = (top + height + this.marginTop) + 'px';
  }

  @HostListener('mouseleave')
  mouseLeaveEvent() {
    this.initTooltip();
    this.tooltipElement.remove();
  }
  ngOnDestroy(): void {
    this.mouseLeaveEvent();
  }


}
