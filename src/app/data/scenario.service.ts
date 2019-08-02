import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ServerResponse } from './serverresponse';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  constructor(
    public http: HttpClient
  ) { }

  public list() {
    return this.http.get("https://" + environment.server + "/a/scenario/list")
    .pipe(
      map((s: ServerResponse) => {
        return JSON.parse(atob(s.content));
      })
    )
  }
}
