import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { switchMap, map } from 'rxjs/operators';
import { ServerResponse } from './serverresponse';
import { from, of } from 'rxjs';
import { VMTemplate } from './vmtemplate';

@Injectable({
  providedIn: 'root'
})
export class VmtemplateService {

  constructor(
    public http: HttpClient
  ) { }

  public list() {
    return this.http.get('https://' + environment.server + '/a/vmtemplate/list')
    .pipe(
      switchMap((s: ServerResponse) => {
        return of(JSON.parse(atob(s.content)))
      })
    )
  }
}
