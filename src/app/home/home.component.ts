import { Component, OnInit } from '@angular/core';
import { UserSessionService } from 'src/app/data/user_session.service';
import { UserSession } from 'src/app/data/user_session';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public userSessions: UserSession[] = [];

  constructor(
    public userSessionService: UserSessionService
  ) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.userSessions = this.userSessionService.list()      
  }

}
