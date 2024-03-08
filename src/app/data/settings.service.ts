import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Subject, concat, throwError } from 'rxjs';
import {
  catchError,
  map,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { themes } from '../step/terminal-themes/themes';
import {
  extractResponseContent,
  GargantuaClientFactory,
} from '../data/gargantua.service';

export interface Settings {
  terminal_theme: (typeof themes)[number]['id'];
}

/**
 * SettingsService is used to handle Settings saved by a user.
 * For Global Settings see TypedSettingsService
 */
@Injectable()
export class SettingsService {
  constructor(private gcf: GargantuaClientFactory) {}
  private garg = this.gcf.scopedClient('/auth');

  private subject = new Subject<Readonly<Settings>>();
  readonly settings$ = concat(this.fetch(), this.subject).pipe(shareReplay(1));

  fetch() {
    return this.garg.get('/settings').pipe(
      map(extractResponseContent),
      tap((s: Readonly<Settings>) => {
        this.subject.next(s);
      })
    );
  }

  set(newSettings: Readonly<Settings>) {
    const params = new HttpParams({ fromObject: newSettings });
    return this.garg.post('/settings', params).pipe(
      catchError((e: HttpErrorResponse) => {
        return throwError(() => e.error);
      }),
      tap(() => this.subject.next(newSettings))
    );
  }

  update(update: Partial<Readonly<Settings>>) {
    return this.settings$.pipe(
      take(1),
      switchMap((currentSettings) => {
        return this.set({ ...currentSettings, ...update });
      })
    );
  }
}
