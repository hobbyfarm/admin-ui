import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[clrDisableSelection]'
})
export class ClarityDisableSelectionDirective implements OnChanges {

  @Input('clrDisableSelection')
  disabled: boolean

  constructor(private elementRef: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
      let nativeRef = this.elementRef.nativeElement
      if (this.disabled) {
        nativeRef.classList.add("clr_disable_selection");
      } else {
        nativeRef.classList.remove("clr_disable_selection");
      }
  }

}
