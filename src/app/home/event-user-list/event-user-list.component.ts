import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ClrModal } from '@clr/angular';
import { Progress } from 'src/app/data/progress';
import { User } from 'src/app/data/user';

interface userListUser extends User {
  numberOfSessions?: number;
  activeScenarioName?: string;
}

@Component({
  selector: 'event-user-list',
  templateUrl: './event-user-list.component.html'  
})
export class EventUserListComponent implements OnInit {

  @ViewChild("userListModal") userListModal: ClrModal;

  @Input()
  public users: User[];

  @Input()
  public progress: Progress[]; 

  @Input()
  public filterName: Function;

  @Output() nameClickedEvent = new EventEmitter<string>();
  
  public userListUsers: userListUser[] = [];

  ngOnInit(): void {}

  public listFilterName(username) {
    this.nameClickedEvent.emit(username);
    this.userListModal.close()
  }

  public openModal(): void {
    this.userListUsers = []
    this.users.forEach(user => {
      let newUser: userListUser = user;
      newUser.activeScenarioName = this.getUsersActiveProgressName(user);
      newUser.numberOfSessions = this.getUsersProgress(user);
      this.userListUsers.push(newUser)
    })
    this.userListModal.open();
  }

  getUsersActiveProgressName(user) {
    let scenarioName = this.progress.filter(p => p.user === user.id && p.finished === false)[0]?.scenario_name    
    return scenarioName ?? "0"
  }

  getUsersProgress(user) {
    return this.progress.filter(p => p.user === user.id).length
  }

}
