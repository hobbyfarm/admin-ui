import { Injectable } from '@angular/core';
import { ServerResponse } from './serverresponse';
import { map, switchMap, tap, combineLatestAll } from 'rxjs/operators';
import { BehaviorSubject, from, of } from 'rxjs';
import { atou } from '../unicode';
import { VMTemplateServiceConfiguration } from './vm-template-service-configuration';
import { Protocol } from './protocol';
import { GargantuaClientFactory } from './gargantua.service';

interface IVMTemplateServiceConfiguration {
  has_webinterface?: boolean;
  has_tab?: boolean;
  no_rewrite_root_path?: boolean;
  rewrite_host_header?: boolean;
  rewrite_origin_header?: boolean;
  disallow_iframe?: boolean;
  disable_authorization_header?: boolean;
  cloud_config?: string;
  name: string;
  port?: number;
  path?: string;
  protocol?: Protocol;
}

@Injectable({
  providedIn: 'root',
})
export class PredefinedServiceService {
  private cachedList: VMTemplateServiceConfiguration[] = [];
  private bh: BehaviorSubject<VMTemplateServiceConfiguration[]> =
    new BehaviorSubject(this.cachedList);
  private fetchedList = false;
  private gargAdmin = this.gcf.scopedClient('/a/predefinedservices');

  constructor(private gcf: GargantuaClientFactory) {}

  public watch() {
    return this.bh.asObservable();
  }

  public list(force = true) {
    if (!force && this.fetchedList) {
      return of(this.cachedList);
    } else {
      return this.gargAdmin.get('/list').pipe(
        switchMap((s: ServerResponse) => {
          const templateServiceConfig: IVMTemplateServiceConfiguration =
            JSON.parse(atou(s.content));
          return of(templateServiceConfig);
        }),
        map((resp: IVMTemplateServiceConfiguration) => {
          let parsedVmtsc = new VMTemplateServiceConfiguration(
            resp.name,
            resp.has_webinterface,
            resp.port,
            resp.path,
            resp.protocol,
            resp.has_tab,
            resp.no_rewrite_root_path,
            resp.rewrite_host_header,
            resp.rewrite_origin_header,
            resp.disallow_iframe,
            resp.disable_authorization_header,
            resp.cloud_config,
          );
          return of(parsedVmtsc);
        }),
        combineLatestAll(),
        tap((vmtsc: VMTemplateServiceConfiguration[]) => {
          this.set(vmtsc);
        }),
      );
    }
  }

  public set(list: VMTemplateServiceConfiguration[]) {
    this.cachedList = list;
    this.fetchedList = true;
    this.bh.next(list);
  }
}
