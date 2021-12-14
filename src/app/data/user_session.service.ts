import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { UserSession } from './user_session';

@Injectable({
    providedIn: 'root',
})
export class UserSessionService {

    constructor(
        public userService: UserService
    ) { }


    public list() {
        var s1 = new UserSession();
        s1.scheduledevent_id = 'b31a6cbe-0b2b-45af-8bdc-badd501cf0ad';
        s1.user_id;
        s1.scenario_id = "k9s-basics"; //UID: ce188681-6252-40db-b217-e1a7fc594ae3
        s1.course_id;
        s1.current_step;
        s1.max_step;
        s1.total_steps;
        s1.finished = false;
        s1.last_update = new Date();
        s1.started;
        var list: UserSession[] = [s1]; 
        return list;
    }
    }