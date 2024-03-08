import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { AppConfig } from './data/config';

@Injectable()
export class AppConfigService {
  private appConfig: AppConfig;

  constructor(private http: HttpClient) {}

  loadAppConfig() {
    return lastValueFrom(this.http.get('/config.json')).then((data) => {
      this.appConfig = data;
    });
  }

  getLogo(logoPath: string) {
    const headers = new HttpHeaders();
    headers.set('Accept', '*');
    return lastValueFrom(
      this.http.get(logoPath, { headers, responseType: 'text' })
    );
  }

  getConfig() {
    return this.appConfig;
  }
}
