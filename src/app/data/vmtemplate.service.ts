import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';
import { ServerResponse } from './serverresponse';
import { of } from 'rxjs';
import { atou } from '../unicode';
import { VMTemplate } from './vmtemplate';
import { HttpParameterCodec } from '@angular/common/http';

export class CustomHttpParamEncoder implements HttpParameterCodec {
    encodeKey(key: string): string {
        return encodeURIComponent(key);
    }
    encodeValue(value: string): string {
            return encodeURIComponent(value);
    }
    decodeKey(key: string): string {
            return decodeURIComponent(key);
    }
    decodeValue(value: string): string {
            return decodeURIComponent(value);
    }
}

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

  public update(template: VMTemplate) {
    let params = new HttpParams({encoder: new CustomHttpParamEncoder()})
    .set('id', template.id)
    .set('name', template.name)
    .set('image', template.image)
    .set('config_map', JSON.stringify(template.config_map))
   
    return this.http.put(environment.server + "/a/vmtemplate/" + template.id + "/update", params)
  }

  public create(template: VMTemplate) {
    let params = new HttpParams()
    .set('name', template.name)
    .set('image', template.image)
    .set('config_map', JSON.stringify(template.config_map))

    return this.http.post(environment.server + "/a/vmtemplate/create", params)
  }

  public get(id: string) {
    return this.http.get(environment.server + "/a/vmtemplate/" + id)
    .pipe(
      switchMap((s: ServerResponse) => {
        return of(JSON.parse(atou(s.content)))
      })
    )
  }

  public delete(id: string) {
    return this.http.delete(environment.server + "/a/vmtemplate/" + id + "/delete")
  }
}
