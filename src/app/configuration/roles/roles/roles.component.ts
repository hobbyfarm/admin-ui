import { Component, OnInit, ViewChild } from '@angular/core';
import { ClrModal } from '@clr/angular';
import { RbacService } from 'src/app/data/rbac.service';
import { Role, Rule } from 'src/app/data/role';
import { RoleService } from 'src/app/data/role.service';
import { EditRuleComponent } from '../edit-rule/edit-rule.component';
import { NewRoleComponent } from '../new-role/new-role.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})

export class RolesComponent implements OnInit {
  public roles: Role[] = [];

  public editingRule: Rule = new Rule();

  private editingRoleIndex: number;
  private editingRuleIndex: number;

  public newRole: Role = new Role();

  public deletingObject: string;

  constructor(
    private roleService: RoleService,
    private rbacService: RbacService
  ) { }

  ngOnInit(): void {
    this.refresh();
  }

  public refresh(): void {
    this.roleService.list()
    .subscribe(
      (r: Role[]) => this.roles = r,
    )
  }

  @ViewChild("editRuleModal") editModal: EditRuleComponent;
  @ViewChild("deleteModal") deleteModal: ClrModal;
  @ViewChild("newRoleModal") newRoleModal: NewRoleComponent;

  public openEdit(): void {
    this.editModal.open();
  }

  public edit(roleIndex: number, ruleIndex: number): void {
    this.editingRoleIndex = roleIndex;
    this.editingRuleIndex = ruleIndex;

    this.editingRule = Object.create(this.roles[roleIndex].rules[ruleIndex])

    this.editModal.open(true);
  }

  public new(roleIndex: number): void {
    this.editingRoleIndex = roleIndex;
    this.editingRuleIndex = this.roles[roleIndex].rules.length;

    this.editingRule = new Rule();

    this.editModal.open(false);
  }

  public openNewRole(): void {
    this.newRole = new Role();
    this.newRoleModal.open();
  }

  public saveRule() {
    this.roles[this.editingRoleIndex].rules[this.editingRuleIndex] = this.editingRule;
    
    this.roleService.update(this.roles[this.editingRoleIndex])
    .subscribe(
      (a: any) => {
        
      }
    )
  }

  public delete(deletingObject: string, roleIndex: number, ruleIndex: number): void {
    this.deletingObject = deletingObject;
    this.editingRoleIndex = roleIndex;
    this.editingRuleIndex = ruleIndex; 

    this.deleteModal.open();
  }

  public doDelete(): void {
    switch (this.deletingObject) {
      case 'rule':
        this.roles[this.editingRoleIndex].rules.splice(this.editingRuleIndex, 1);
        this.roleService.update(this.roles[this.editingRoleIndex])
        .subscribe(
          (a: any) => {
            this.deleteModal.close();
          }
        )
        break;
      case 'role':
        this.roleService.delete(this.roles[this.editingRoleIndex].name)
        .subscribe(
          (a: any) => {
            this.roles.splice(this.editingRoleIndex, 1);
            this.deleteModal.close();
          }
        )
        break;
    }
  }

}
