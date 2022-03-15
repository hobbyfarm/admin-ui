import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Rule } from 'src/app/data/role';

@Component({
  selector: 'rule-form',
  templateUrl: './rule-form.component.html',
  styleUrls: ['./rule-form.component.scss']
})
export class RuleFormComponent implements OnInit {
  private rbacApiGroup: string = "rbac.authorization.k8s.io";
  private hobbyfarmApiGroup: string = "hobbyfarm.io";
  
  @Input()
  public rule: Rule = new Rule();

  private apiGroupControl: FormControl = new FormControl();
  private resourceControl: FormControl = new FormControl();
  private verbControl: FormControl = new FormControl();

  ruleForm = new FormGroup({
    apiGroups: this.apiGroupControl,
    resources: this.resourceControl,
    verbs: this.verbControl
  })

  public apiGroups: string[] = [
    this.rbacApiGroup,
    this.hobbyfarmApiGroup
  ]

  public resources: string[] = [
    "virtualmachines",
    "virtualmachineclaims",
    "virtualmachinetemplates",
    "environments",
    "virtualmachinesets",
    "courses",
    "scenarios",
    "sessions",
    "progresses",
    "accesscodes",
    "users",
    "scheduledevents",
    "dynamicbindrequests",
    "roles",
    "rolebindings"
  ]

  public verbs: string [] = [
    "list",
    "get",
    "create",
    "update",
    "delete",
    "watch"
  ]

  constructor() { }

  ngOnInit(): void {
    this.resourceControl.valueChanges.subscribe(
      (resources: string[]) => {
        this.resourceSelected(resources)
      }
    )
  }


  public resourceSelected(resources: string[]) {
    if (this.apiGroupControl.value == null) {
      this.apiGroupControl.setValue([], {
        emitEvent: false
      })
    }

    console.log("calling resourceSelected", resources);

    resources.forEach((r: string) => {
      if (r == "roles" || r == "rolebindings") {
        if ((this.apiGroupControl.value as Array<string>).find((ag: string) => ag == this.rbacApiGroup) == undefined) {
          let groups = (this.apiGroupControl.value as Array<string>).push(this.rbacApiGroup)
          this.apiGroupControl.setValue(groups, {
            emitEvent: false
          })
        }
      } else {
        if ((this.apiGroupControl.value as Array<string>).find((ag: string) => ag == this.hobbyfarmApiGroup) == undefined) {
          let groups = (this.apiGroupControl.value as Array<string>).push(this.hobbyfarmApiGroup)
          this.apiGroupControl.setValue(groups, {
            emitEvent: false
          })
        }
      }
    })
  }

  public clearField(field: string): void {
    switch (field) {
      case 'api':
        this.rule.apiGroups = [];
        break;
      case 'resources':
        this.rule.resources = [];
        break;
      case 'verbs':
        this.rule.verbs = [];
        break;
    }
  }

  public addAll(field: string): void {
    switch (field) {
      case 'api':
        this.rule.apiGroups = this.apiGroups;
        break;
      case 'resources':
        this.rule.resources = ["*"];
        break;
      case 'verbs':
        this.rule.verbs = ["*"];
        break;
    }
  }

}
