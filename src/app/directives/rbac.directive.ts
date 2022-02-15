import { NgIfContext } from '@angular/common';
import { Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { resourceUsage } from 'process';
import { RbacService } from '../data/rbac.service';

@Directive({
  selector: '[rbac]'
})
export class RbacDirective implements OnInit {
  private isHidden = true;
  private permissions: string[] = [];
  private logcalOp = 'AND';

  private elseRef: TemplateRef<any>;

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private rbacService: RbacService
  ) { }

  ngOnInit(): void {
      this.updateView();
  }

  @Input()
  set rbac(val) {
    this.permissions = val;
    this.updateView();
  }

  @Input()
  set rbacOp(val) {
    this.logcalOp = val;
    this.updateView();
  }

  @Input()
  set rbacElse(val: TemplateRef<any>) {
    this.elseRef = val;
  }

  private updateView() {
    if (this.checkPermission()) {
      if (this.isHidden) {
        if (this.elseRef) {
          this.viewContainer.clear();
        }
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.isHidden = false;
      }
    } else {
      this.isHidden = true;
      this.viewContainer.clear();

      if (this.elseRef) {
        this.viewContainer.createEmbeddedView(this.elseRef);
      }
    }
  }
  
  private checkPermission(): boolean {
    let hasPermission = false;

    for (const checkPermission of this.permissions) {
      // resource.verb
      let split = checkPermission.split('.')
      if (this.rbacService.Grants(split[0], split[1])) {
        hasPermission = true;

        if (this.logcalOp === 'OR') {
          break;
        }
      } else {
        hasPermission = false;
        if (this.logcalOp === 'AND') {
          break;
        }
      }
    }

    return hasPermission;
  }
}
