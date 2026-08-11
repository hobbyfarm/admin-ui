import { TemplateRef, ViewContainerRef } from '@angular/core';
import { RbacService } from '../data/rbac.service';
import { RbacDirective } from './rbac.directive';

describe('RbacDirective', () => {
  it('should create an instance', () => {
    const directive = new RbacDirective(
      {} as TemplateRef<unknown>,
      jasmine.createSpyObj<ViewContainerRef>('ViewContainerRef', [
        'clear',
        'createEmbeddedView',
      ]),
      jasmine.createSpyObj<RbacService>('RbacService', ['Grants']),
    );
    expect(directive).toBeTruthy();
  });
});
