import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { finalize, first, map, shareReplay, take, tap } from 'rxjs/operators';
import { atou } from '../unicode';
import { environment } from 'src/environments/environment';
import { ServerResponse } from './serverresponse';

type GargantuaClientDefaults = {
  get<T = ServerResponse>(path: string, body?: any): Observable<T>;
  post<T = ServerResponse>(path: string, body: any): Observable<T>;
  put<T = ServerResponse>(path: string, body: any): Observable<T>;
  delete<T = ServerResponse>(path: string): Observable<T>;
};

export type GargantuaClient = GargantuaClientDefaults &
  Pick<HttpClient, keyof GargantuaClientDefaults>;

@Injectable()
export class GargantuaClientFactory {
  constructor(private http: HttpClient) {}

  scopedClient(prefix: string): GargantuaClient {
    const baseUrl = environment.server + prefix;

    return new Proxy(this.http, {
      get(target, key) {
        const prop = (target as any)[key];
        return typeof prop === 'function'
          ? (path: string, ...args: any[]) =>
              prop.call(target, baseUrl + path, ...args)
          : prop;
      },
    });
  }
}

class BaseClient<U extends 'get' | 'list', T> {
  cache = new Map<string, BehaviorSubject<U extends 'get' ? T : T[]>>();
  inFlightRequests = new Map<string, Observable<U extends 'get' ? T : T[]>>();
  constructor(protected garg: GargantuaClient) {}

  get(
    id: string,
    force: boolean = false,
  ): Observable<U extends 'get' ? T : T[]> {
    // Return the cached value if available
    const cachedResult = this.cache.get(id);
    if (!force && cachedResult !== undefined)
      return cachedResult.asObservable().pipe(first());

    // If a request is in flight, return the existing Observable
    const inFlight = this.inFlightRequests.get(id);
    if (!force && inFlight) return inFlight.pipe(first());

    // Start a new request
    const result$ = this.garg.get('/' + id).pipe(
      map(extractResponseContent),
      tap((it: U extends 'get' ? T : T[]) => {
        let subject = this.cache.get(id);
        if (!subject) {
          subject = new BehaviorSubject<U extends 'get' ? T : T[]>(it);
          this.cache.set(id, subject);
        } else {
          subject.next(it);
        }
      }),
      shareReplay(1), // Allow multiple subscribers to share the same result
      take(1),
      finalize(() => this.inFlightRequests.delete(id)), // remove from inFlightRequests map on completion
    );

    // Add to the inFlightRequests map immediately
    this.inFlightRequests.set(id, result$);

    return result$;
  }

  getStatus(id: string) {
    return this.garg.get('/' + id).pipe(map(extractResponseStatus));
  }
}

export class ResourceClient<T> extends BaseClient<'get', T> {}

export class ListableResourceClient<
  T extends { id: string },
> extends ResourceClient<T> {
  listClient: BaseClient<'list', T> = new BaseClient<'list', T>(this.garg);

  deleteAndNotify(id: string) {
    const cacheKey = '/list';
    const subject = this.listClient.cache.get(cacheKey);
    if (!subject) {
      return;
    } else {
      const l = subject.getValue().filter((t) => t.id != id);
      subject.next(l);
    }
  }

  addAndNotify(t: T) {
    const cacheKey = '/list';
    const subject = this.listClient.cache.get(cacheKey);
    if (!subject) {
      return;
    } else {
      const l = subject.getValue();
      l.push(t);
      subject.next(l);
    }
  }

  list(listId: string = '', force: boolean = false): Observable<T[]> {
    let prefix = '/list';
    if (listId !== '') {
      prefix += '/';
    }
    return this.listClient.get(`${prefix}${listId}`, force);
  }
}

export const extractResponseContent = (s: ServerResponse) =>
  JSON.parse(atou(s.content));

export const extractResponseStatus = (s: ServerResponse) => ({
  type: s.type,
  status: s.status,
});
