import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ServerResponse } from './serverresponse';
import { map, switchMap, combineAll, tap } from 'rxjs/operators';
import { BehaviorSubject, from, of } from 'rxjs';
import { atou } from '../unicode';
import { VMTemplateServiceConfiguration } from './vm-template-service-configuration';
import YAML from 'yaml';

@Injectable({
  providedIn: 'root'
})
export class PredefinedServiceService {

  private cachedList: VMTemplateServiceConfiguration[] = []
  private bh: BehaviorSubject<VMTemplateServiceConfiguration[]> = new BehaviorSubject(this.cachedList);
  private fetchedList = false;

  constructor(
    public http: HttpClient
  ) { }

  public watch() {
    return this.bh.asObservable();
  }

  public list(force=false) {
    if (!force && this.fetchedList)  {
      return of(this.cachedList);
  } else {
      return this.http.get(environment.server + "/a/predefinedservices/list")
        .pipe(
          switchMap((s: ServerResponse) => {
            return from(JSON.parse(atou(s.content)))
          }),
          map((vmtsc: VMTemplateServiceConfiguration) => {
            console.log(vmtsc);
            vmtsc.cloudConfigMap = YAML.parse(vmtsc.cloudConfigString);
            return of(vmtsc);
          }),
          combineAll(),
          tap((vmtsc: VMTemplateServiceConfiguration[]) => {
              this.set(vmtsc);
            }
          ),
        )
    }
  }

  public set(list: VMTemplateServiceConfiguration[]){
    this.cachedList = list;
    this.fetchedList = true;
    this.bh.next(list);
  }
}
