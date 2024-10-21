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
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface Settings {
  terminal_theme: (typeof themes)[number]['id'];
  hide_usernames_status: boolean;
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

  public settingsForm: FormGroup = new FormGroup({
    terminal_theme: new FormControl<typeof themes[number]['id'] | null> (null, [Validators.required,]),
    hide_usernames_status: new FormControl<boolean>(false),
  })

  fetch() {
    return this.garg.get('/settings').pipe(
      map(extractResponseContent),
      map((s: Readonly<Settings | null>) =>
        s
          ? s
          : ({
              terminal_theme: themes[0].id,
              hide_usernames_status: false
            } as Settings),
      ),
      tap((s: Settings) => {
        s.hide_usernames_status = JSON.parse(String(s.hide_usernames_status ?? false));
        this.settingsForm.patchValue(s);
        this.subject.next(s);
      }),
      catchError((error) => {
        console.error('Error on fetching settings:', error);
        return throwError(() => error);
      })
    );
  }

  set(newSettings: Readonly<Settings>) {
    const params = new HttpParams({ fromObject: newSettings });
    return this.garg.post('/settings', params).pipe(
      catchError((e: HttpErrorResponse) => {
        return throwError(() => e.error);
      }),
      tap(() => {
        this.settingsForm.patchValue(newSettings);  
        this.subject.next(newSettings);
      })
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

  getForm() {
    return this.settingsForm;
  }
}
