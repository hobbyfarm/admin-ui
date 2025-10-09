import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ServerResponse } from './serverresponse';
import { formatDate } from '@angular/common';
import { EnvironmentAvailability } from './environmentavailability';
import { Environment } from './environment';
import { atou } from '../unicode';
import { GargantuaClientFactory } from './gargantua.service';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  constructor(private gcf: GargantuaClientFactory) {}
  private gargAdmin = this.gcf.scopedClient('/a/environment');

  public get(id: string) {
    return this.gargAdmin
      .get(`/${id}`)
      .pipe(map((s: ServerResponse) => JSON.parse(atou(s.content))));
  }

  public list() {
    return this.gargAdmin
      .get('/list')
      .pipe(map((s: ServerResponse) => JSON.parse(atou(s.content))));
  }

  public available(env: string, start: Date, end: Date) {
    const startString = formatDate(
      start,
      'E LLL dd HH:mm:ss UTC yyyy',
      'en-US',
      'UTC',
    );
    const endString = formatDate(
      end,
      'E LLL dd HH:mm:ss UTC yyyy',
      'en-US',
      'UTC',
    );

    const params = new HttpParams()
      .set('start', startString)
      .set('end', endString);

    return this.gargAdmin.post(`/${env}/available`, params).pipe(
      map((s: ServerResponse) => JSON.parse(atou(s.content))),
      map((ea: EnvironmentAvailability) => {
        ea.environment = env;
        return ea;
      }),
    );
  }

  public add(env: Environment) {
    const params = new HttpParams()
      .set('display_name', env.display_name)
      .set('dnssuffix', env.dnssuffix)
      .set('provider', env.provider)
      .set('template_mapping', JSON.stringify(env.template_mapping))
      .set('environment_specifics', JSON.stringify(env.environment_specifics))
      .set('ip_translation_map', JSON.stringify(env.ip_translation_map))
      .set('ws_endpoint', env.ws_endpoint)
      .set('count_capacity', JSON.stringify(env.count_capacity));

    return this.gargAdmin.post('/create', params);
  }

  public update(env: Environment) {
    const params = new HttpParams()
      .set('display_name', env.display_name)
      .set('dnssuffix', env.dnssuffix)
      .set('provider', env.provider)
      .set('template_mapping', JSON.stringify(env.template_mapping))
      .set('environment_specifics', JSON.stringify(env.environment_specifics))
      .set('ip_translation_map', JSON.stringify(env.ip_translation_map))
      .set('ws_endpoint', env.ws_endpoint)
      .set('count_capacity', JSON.stringify(env.count_capacity));

    return this.gargAdmin.put(`/${env.name}/update`, params);
  }
}
