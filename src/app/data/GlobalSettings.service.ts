import { Injectable } from '@angular/core';
import { Subject, concat } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import {
  extractResponseContent,
  GargantuaClientFactory,
} from '../data/gargantua.service';
import { TypedInput, TypedInputType } from '../typed-form/TypedInput';

export interface Settings {
  name: string,
  displayName: string;
  type: string;
  value: string;
  category: string;
  enumValues?: string[];
  weight: number;
  scope: string
}

@Injectable()
export class GlobalSettingsService {
  constructor(private gcf: GargantuaClientFactory) {}
  private garg = this.gcf.scopedClient('/settings');

  private subjects: Subject<Readonly<TypedInput[]>>[] = [];
  private settings$;

  fetch(scope: string) {
    return this.garg.get('/list/' + scope).pipe(
      map(extractResponseContent),
      tap((s: Readonly<Settings[]>) => {
        let l: TypedInput[];
        s.forEach(s => {
            let typedInput: TypedInput;
            typedInput.id = s.name
            typedInput.category = s.category;
            typedInput.value = s.value;
            typedInput.weight = s.weight;
            typedInput.name = s.displayName;
            switch(s.type) {
                case "string":
                    typedInput.type = TypedInputType.STRING;
                    break;
                case "boolean":
                    typedInput.type = TypedInputType.BOOLEAN;
                    break;
                case "integer":
                    typedInput.type = TypedInputType.INTEGER;
                    break;
                case "float":
                    typedInput.type = TypedInputType.FLOAT;
                    break;
                case "enum":
                    typedInput.type = TypedInputType.ENUM;
                    typedInput.enumValues = s.enumValues ?? [];
                    break;
            }
           l.push(typedInput);
        })

        this.subjects[scope].next(l);
      })
    );
  }

  getScopedSettings(scope: string) {
    if (this.subjects[scope]) {
      this.subjects[scope] = new Subject<Readonly<TypedInput[]>>();
      this.settings$[scope] = concat(
        this.fetch(scope),
        this.subjects[scope]
      ).pipe(shareReplay(1));
    }
    return this.settings$[scope];
  }
}
