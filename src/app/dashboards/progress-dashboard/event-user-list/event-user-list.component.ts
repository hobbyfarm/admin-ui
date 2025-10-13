import {
  Component,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { ClrModal } from '@clr/angular';
import { Progress } from 'src/app/data/progress';
import { User } from 'src/app/data/user';

interface UserListUser extends User {
  numberOfSessions?: number;
  activeScenarioName?: string;
}

@Component({
  selector: 'event-user-list',
  templateUrl: './event-user-list.component.html',
})
export class EventUserListComponent {
  @ViewChild('userListModal') userListModal: ClrModal;

  @Input()
  public users: User[];

  @Input()
  public progress: Progress[];

  @Output() userSelected = new EventEmitter<User>();

  public userListUsers: UserListUser[] = [];

  public onUserSelect(user) {
    this.userSelected.emit(user);
    this.userListModal.close();
  }

  public openModal(): void {
    this.userListUsers = this.users.map((user) => ({
      ...user,
      activeScenarioName: this.getUsersActiveProgressName(user),
      numberOfSessions: this.getUsersProgress(user),
    }));
    this.userListModal.open();
  }

  getUsersActiveProgressName(user) {
    const scenarioName = this.progress.filter(
      (p) => p.user === user.id && p.finished === false,
    )[0]?.scenario_name;
    return scenarioName ?? '';
  }

  getUsersProgress(user) {
    return this.progress.filter((p) => p.user === user.id).length;
  }
}
