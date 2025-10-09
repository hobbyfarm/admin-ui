import {
  Directive,
  EventEmitter,
  HostListener,
  Output,
  Renderer2,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: 'textarea[resize]',
})
export class ResizableTextAreaDirective implements OnDestroy {
  @Output() dimensionsChange = new EventEmitter<{
    width: number;
    height: number;
  }>();

  width: number = 0;
  height: number = 0;

  mouseMoveListener?: () => void;

  @HostListener('mousedown', ['$event.target'])
  onMouseDown(el: HTMLTextAreaElement) {
    this.width = el.offsetWidth;
    this.height = el.offsetHeight;
    this.mouseMoveListener = this.renderer.listen(
      'document',
      'mousemove',
      () => {
        if (this.width !== el.offsetWidth || this.height !== el.offsetHeight) {
          this.dimensionsChange.emit({
            width: el.offsetWidth,
            height: el.offsetHeight,
          });
        }
      },
    );
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.ngOnDestroy();
  }

  constructor(private renderer: Renderer2) {}

  ngOnDestroy() {
    this.mouseMoveListener?.();
  }
}
