import { ElementRef } from '@angular/core';
import { ClarityDisableSelectionDirective } from './clarity-disable-selection.directive';

describe('ClarityDisableSelectionDirective', () => {
  it('should create an instance', () => {
    const directive = new ClarityDisableSelectionDirective(
      new ElementRef(document.createElement('div')),
    );
    expect(directive).toBeTruthy();
  });
});
