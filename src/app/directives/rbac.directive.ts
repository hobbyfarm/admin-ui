import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { isResource, isVerb } from '../data/rbac';
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

  private async updateView() {
    const hasPermission: boolean = await this.checkPermission();
    if (hasPermission) {
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
  
  private async checkPermission(): Promise<boolean> {
    let hasPermission = false;

    for (const checkPermission of this.permissions) {
      // resource.verb
      const split: string[] = checkPermission.split('.');
      if(isResource(split[0]) && isVerb(split[1])) {
        hasPermission = await this.rbacService.Grants(split[0], split[1]);
      }
      if ((hasPermission && this.logcalOp === 'OR') || (!hasPermission && this.logcalOp === 'AND')) {
        break;
      }
    }

    return hasPermission;
  }
}
