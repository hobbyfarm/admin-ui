import { Injectable } from '@angular/core';
import { Progress, ProgressStep } from './progress';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ServerResponse } from './serverresponse';
import { atou } from '../unicode';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ProgressService {

    constructor(
        public http: HttpClient
    ) { 

    }

    public list(id: string, includeFinished: boolean = false) {
        return this.http.get(environment.server + "/a/progress/scheduledevent/" + id + "?includeFinished="+includeFinished)
        .pipe(
            map((s: ServerResponse) => {
                return JSON.parse(atou(s.content));
            }),
            map((pList: Progress[]) => {
                pList.forEach((p: Progress) => {
                    p.last_update = new Date(p.last_update);
                    p.started = new Date(p.started);
                    p.finished = JSON.parse(String(p.finished))
                    p.steps.forEach((s: ProgressStep) => {
                        s.timestamp = new Date(s.timestamp);
                    })
                });
                return pList;
            })
        )
  }
}