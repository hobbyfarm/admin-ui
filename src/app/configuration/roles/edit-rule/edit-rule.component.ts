import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ClrModal } from '@clr/angular';
import { Rule } from 'src/app/data/role';
import { RoleService } from 'src/app/data/role.service';

@Component({
  selector: 'edit-rule',
  templateUrl: './edit-rule.component.html',
  styleUrls: ['./edit-rule.component.scss'],
})
export class EditRuleComponent implements OnInit {
  public edit: boolean = false;
  public modalOpen: boolean = false;
  public formValid: boolean = false;

  @Input()
  public rule: Rule;

  @Output()
  public saved: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  @ViewChild('modal') modal: ClrModal;

  ngOnInit(): void {}

  public open(edit: boolean = false): void {
    this.modal.open();
  }

  public save(): void {
    this.saved.next(true);
    this.modal.close();
  }
}
