import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { ClrModal } from '@clr/angular';
import { ServerResponse } from 'src/app/data/serverresponse';
import { User } from 'src/app/data/user';
import { UserService } from 'src/app/data/user.service';

export interface deletionInformation {
  user: User;
  deleted: boolean;
  message: string;
}

@Component({
  selector: 'delete-process-modal',
  templateUrl: './delete-process-modal.component.html',
  styleUrls: ['./delete-process-modal.component.scss'],
})
export class DeleteProcessModalComponent implements OnInit {
  @Output()
  public done: EventEmitter<boolean> = new EventEmitter(null);

  @Input()
  public selectedUsers: User[];

  public initialUsers: number = -1;
  public deletedUsers: number = 0;
  public deleteInfo: deletionInformation[] = [];

  constructor(public userService: UserService) {}

  @ViewChild('modal') modal: ClrModal;

  ngOnInit(): void {}

  open(): void {
    this.modal.open();
    this.initialUsers = this.selectedUsers.length;
    this.selectedUsers.forEach((user) => {
      this.userService.deleteUser(user.id).subscribe({
        next: (s: ServerResponse) => {
          this.deleteInfo.push({
            user: user,
            deleted: true,
            message: s.message,
          });
          this.deletedUsers++;
        },
        error: (s: ServerResponse) => {
          this.deleteInfo.push({
            user: user,
            deleted: false,
            message: s.message,
          });
          this.deletedUsers++;
        },
      });
    });
  }

  deleteDone(): void {
    this.done.emit(true);
    this.deletedUsers = 0;
    this.deleteInfo = [];
    this.modal.close();
  }
}
