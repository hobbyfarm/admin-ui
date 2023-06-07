import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { themes } from '../step/terminal-themes/themes';
import {
  extractResponseContent,
  GargantuaClientFactory,
} from '../data/gargantua.service';
import { InputValidation, TypedInput } from '../typed-form/TypedInput';
import { TypedInputRepresentation } from '../typed-form/TypedInput';
import { TypedInputType } from '../typed-form/TypedInput';

export class PreparedSettings {
  name: string;
  value: any;
  scope: string;
  weight: number;
  group: string;
  // Following is corresponding to property.Property
  dataType: 'string' | 'integer' | 'float' | 'boolean';
  valueType: 'scalar' | 'array' | 'map';
  displayName?: string;
  // Following represents SettingValidation
  required?: boolean;
  maximum?: number;
  minimum?: number;
  maxLength?: number;
  minLength?: number;
  format?: string;
  pattern?: string;
  enum?: string[];
  default?: string;
  uniqueItems?: boolean;
}

@Injectable()
export class TypedSettingsService {
  constructor(private gcf: GargantuaClientFactory) {}
  private garg = this.gcf.scopedClient('/setting');

  public list(scope: string) {
    return this.garg.get('/list/' + scope).pipe(
      map(extractResponseContent),
      map((pList: PreparedSettings[]) => {
        return this.buildSettingsList(pList);
      })
    );
  }

  private buildSettingsList(pList: PreparedSettings[]) {
    let settings: TypedInput[] = [];

    pList.forEach((preparedSetting: PreparedSettings) => {
      let representation: TypedInputRepresentation;
      let inputType: TypedInputType;
      switch (preparedSetting.valueType) {
        case 'array':
          representation = TypedInputRepresentation.ARRAY;
          break;
        case 'map':
          representation = TypedInputRepresentation.MAP;
          break;
        case 'scalar':
          representation = TypedInputRepresentation.SCALAR;
      }
      switch (preparedSetting.dataType) {
        case 'boolean':
          inputType = TypedInputType.BOOLEAN;
          break;
        case 'float':
          inputType = TypedInputType.FLOAT;
          break;
        case 'integer':
          inputType = TypedInputType.INTEGER;
          break;
        case 'string':
          inputType = TypedInputType.STRING;
      }
      const setting = new TypedInput({
        id: preparedSetting.name,
        name:
          preparedSetting.displayName == ''
            ? preparedSetting.name
            : preparedSetting.displayName,
        category: preparedSetting.group,
        representation: representation,
        type: inputType,
        validation: {
          required: preparedSetting.required,
          maximum: preparedSetting.maximum,
          minimum: preparedSetting.minimum,
          maxLength: preparedSetting.maxLength,
          minLength: preparedSetting.minLength,
          format: preparedSetting.format,
          pattern: preparedSetting.pattern,
          enum: preparedSetting.enum,
          default: preparedSetting.default,
          uniqueItems: preparedSetting.uniqueItems,
        } as InputValidation,
        value: preparedSetting.value,
        weight: preparedSetting.weight,
      });

      settings.push(setting);
    });
    return settings;
  }
}
