import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';
import { ServerResponse } from './serverresponse';
import { of } from 'rxjs';
import { atou } from '../unicode';

@Injectable({
  providedIn: 'root'
})
export class VmtemplateService {

  constructor(
    public http: HttpClient
  ) { }

  public list() {
    return this.http.get(environment.server + '/a/vmtemplate/list')
    .pipe(
      switchMap((s: ServerResponse) => {
        return of(JSON.parse(atou(s.content)))
      })
    )
  }
}
