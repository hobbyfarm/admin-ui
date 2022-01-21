import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ClrModal } from '@clr/angular';
import { Progress } from 'src/app/data/progress';
import { User } from 'src/app/data/user';

@Component({
  selector: 'event-user-list',
  templateUrl: './event-user-list.component.html',
  styleUrls: ['./event-user-list.component.scss']
})
export class EventUserListComponent implements OnInit {

  public userListOpen: boolean = false;

  @ViewChild("userListModal") userListModal: ClrModal;

  @Input()
  public users: User[];

  @Input()
  public progress: Progress[]; 

  @Input()
  public filterName: Function;

  @Output() nameClickedEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  public listFilterName(username) {
    this.nameClickedEvent.emit(username);
    this.userListOpen = false
  }

  public openModal(): void {
    this.userListModal.open();
  }

  get open() {
    return this.userListOpen;
  }
  
  set open(value: boolean) {
    this.userListOpen = value;    
  }

  getUsersProgress(user) { 
    return this.progress.filter(p => p.user === user.id).length
  }

}
