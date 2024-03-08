import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ServerResponse } from './serverresponse';
import { map, switchMap, tap, combineLatestAll } from 'rxjs/operators';
import { BehaviorSubject, from, of } from 'rxjs';
import { atou } from '../unicode';
import { VMTemplateServiceConfiguration } from './vm-template-service-configuration';


interface IVMTemplateServiceConfiguration {
  has_webinterface?: boolean,
  has_tab?: boolean,
  no_rewrite_root_path?: boolean,
  rewrite_host_header?: boolean,
  rewrite_origin_header?: boolean,
  disallow_iframe?: boolean,
  cloud_config?: string,
  name: string,
  port?: number,
  path?: string,
}

@Injectable({
  providedIn: 'root'
})
export class PredefinedServiceService {

  private cachedList: VMTemplateServiceConfiguration[] = [];
  private bh: BehaviorSubject<VMTemplateServiceConfiguration[]> = new BehaviorSubject(this.cachedList);
  private fetchedList = false;

  constructor(
    public http: HttpClient
  ) { }

  public watch() {
    return this.bh.asObservable();
  }

  public list(force = true) {
    if (!force && this.fetchedList) {
      return of(this.cachedList);
    } else {
      return this.http.get(environment.server + '/a/predefinedservices/list')
        .pipe(
          switchMap((s: ServerResponse) => {
            return from(JSON.parse(atou(s.content)));
          }),
          map((resp: IVMTemplateServiceConfiguration) => {
            let parsedVmtsc = new VMTemplateServiceConfiguration(
              resp.name, 
              resp.has_webinterface, 
              resp.port, 
              resp.path, 
              resp.has_tab, 
              resp.no_rewrite_root_path, 
              resp.rewrite_host_header, 
              resp.rewrite_origin_header, 
              resp.disallow_iframe, 
              resp.cloud_config
              )
            return of(parsedVmtsc);
          }),
          combineLatestAll(),
          tap((vmtsc: VMTemplateServiceConfiguration[]) => {
            this.set(vmtsc);
          }
          ),
        );
    }
  }

  public set(list: VMTemplateServiceConfiguration[]) {
    this.cachedList = list;
    this.fetchedList = true;
    this.bh.next(list);
  }
}
