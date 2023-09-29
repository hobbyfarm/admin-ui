import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { switchMap, tap } from 'rxjs/operators';
import { ServerResponse } from './serverresponse';
import { of } from 'rxjs';
import { atou } from '../unicode';
import { VMTemplate } from './vmtemplate';
import { HttpParameterCodec } from '@angular/common/http';
import {
  GargantuaClientFactory,
  ListableResourceClient,
} from './gargantua.service';

// Custom Encoder to prevent Angulars default En-/Decoder from decoding special Characters again after encoding them, see https://github.com/angular/angular/blob/875851776c2f1a688554e91b8f5352984a71d16b/packages/common/http/src/params.ts#L94.
// This behaviour lead to the Data not being saved in Gargantua if it contains ';'.
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
  providedIn: 'root',
})
export class VmtemplateService extends ListableResourceClient<VMTemplate> {
  constructor(public http: HttpClient, gcf: GargantuaClientFactory) {
    super(gcf.scopedClient('/a/vmtemplate'));
  }

  public update(template: VMTemplate) {
    let params = new HttpParams({ encoder: new CustomHttpParamEncoder() })
      .set('id', template.id)
      .set('name', template.name)
      .set('image', template.image)
      .set('config_map', JSON.stringify(template.config_map));

    return this.http.put(
      environment.server + '/a/vmtemplate/' + template.id + '/update',
      params
    );
  }

  public create(template: VMTemplate) {
    let params = new HttpParams({ encoder: new CustomHttpParamEncoder() })
      .set('name', template.name)
      .set('image', template.image)
      .set('config_map', JSON.stringify(template.config_map));

    return this.http
      .post(environment.server + '/a/vmtemplate/create', params)
      .pipe(
        tap(() => {
          this.list('', true);
        })
      );
  }

  public get(id: string) {
    return this.http.get(environment.server + '/a/vmtemplate/' + id).pipe(
      switchMap((s: ServerResponse) => {
        return of(JSON.parse(atou(s.content)));
      })
    );
  }

  public delete(id: string) {
    return this.http
      .delete(environment.server + '/a/vmtemplate/' + id + '/delete')
      .pipe(
        tap(() => {
          this.deleteAndNotify(id);
        })
      );
  }
}
