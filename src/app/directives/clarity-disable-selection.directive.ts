import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[clrDisableSelection]',
})
export class ClarityDisableSelectionDirective implements OnChanges {
  @Input('clrDisableSelection')
  disabled: boolean;

  constructor(private elementRef: ElementRef) {}

  ngOnChanges(): void {
    const nativeRef = this.elementRef.nativeElement;
    if (this.disabled) {
      nativeRef.classList.add('clr_disable_selection');
    } else {
      nativeRef.classList.remove('clr_disable_selection');
    }
  }
}
