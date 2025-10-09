import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import {
  extractResponseContent,
  GargantuaClientFactory,
} from '../data/gargantua.service';
import { InputValidation, TypedInput } from '../typed-form/TypedInput';
import { TypedInputRepresentation } from '../typed-form/TypedInput';
import { TypedInputType } from '../typed-form/TypedInput';
import { of } from 'rxjs';

type SettingsValueType = TypedInput['value'];

export class PreparedSettings {
  name: string;
  value: SettingsValueType;
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

export class PreparedScope {
  name: string;
  displayName: string;
}

@Injectable()
export class TypedSettingsService {
  constructor(private gcf: GargantuaClientFactory) {}
  private garg = this.gcf.scopedClient('/setting');
  private scopeGarg = this.gcf.scopedClient('/scope');

  private cachedTypedInputList: Map<string, Map<string, TypedInput>> =
    new Map();

  // Maps TypedInput representation to corresponding string
  private typedInputRepresentationList: TypedInputRepresentation[] = [
    TypedInputRepresentation.ARRAY,
    TypedInputRepresentation.MAP,
    TypedInputRepresentation.SCALAR,
  ];
  private typedInputRepresentationStringList: string[] = [
    'array',
    'map',
    'scalar',
  ];

  // Maps TypedInput type to corresponding string
  private typedInputDataTypeList: TypedInputType[] = [
    TypedInputType.STRING,
    TypedInputType.BOOLEAN,
    TypedInputType.FLOAT,
    TypedInputType.INTEGER,
  ];
  private typedInputDataTypeStringList: string[] = [
    'string',
    'boolean',
    'float',
    'integer',
  ];

  public get(scope: string, setting: string) {
    if (this.cachedTypedInputList && this.cachedTypedInputList.has(scope)) {
      const scopedSettings = this.cachedTypedInputList.get(scope)!;
      if (scopedSettings.has(setting)) {
        return of(scopedSettings.get(setting) ?? ({} as TypedInput));
      } else {
        return of({} as TypedInput);
      }
    } else {
      return this.list(scope).pipe(
        tap((typedInputs: TypedInput[]) => {
          const m: Map<string, TypedInput> = new Map();
          typedInputs.forEach((typedSetting) => {
            m.set(typedSetting.id, typedSetting);
          });
          this.cachedTypedInputList.set(scope, m);
        }),
        map((typedInputs) => {
          return (
            typedInputs.find((typedInput) => {
              return typedInput.id === setting;
            }) ?? ({} as TypedInput)
          );
        }),
      );
    }
  }

  public list(scope: string) {
    return this.garg.get('/list/' + scope).pipe(
      map(extractResponseContent),
      map((pList: PreparedSettings[]) => {
        if (!pList) {
          return [];
        }
        return this.buildTypedInputList(pList);
      }),
    );
  }

  public updateCollection(settings: TypedInput[]) {
    const preparedSettings = this.buildPreparedSettingsList(settings);
    return this.garg.put('/updatecollection', JSON.stringify(preparedSettings));
  }

  public listScopes() {
    return this.scopeGarg.get('/list').pipe(
      map(extractResponseContent),
      map((pList: PreparedScope[]) => {
        return pList ?? [];
      }),
    );
  }

  private buildTypedInputList(pList: PreparedSettings[]) {
    const settings: TypedInput[] = [];

    pList.forEach((preparedSetting: PreparedSettings) => {
      const typedInputRepresentationIndex =
        this.typedInputRepresentationStringList.indexOf(
          preparedSetting.valueType,
        );
      const representation: TypedInputRepresentation =
        this.typedInputRepresentationList[
          typedInputRepresentationIndex == -1
            ? 0
            : typedInputRepresentationIndex
        ];

      const typedInputTypeIndex = this.typedInputDataTypeStringList.indexOf(
        preparedSetting.dataType,
      );
      const inputType: TypedInputType =
        this.typedInputDataTypeList[
          typedInputTypeIndex == -1 ? 0 : typedInputTypeIndex
        ];

      const value = preparedSetting.value as SettingsValueType;

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
        value,
        weight: preparedSetting.weight,
      });

      settings.push(setting);
    });
    return settings;
  }

  private buildPreparedSettingsList(inputs: TypedInput[]) {
    const preparedSettings: Partial<PreparedSettings>[] = [];
    inputs.forEach((input: TypedInput) => {
      // Maps will not be converted correctly with JSON.stringify, we have to convert them to an Object.
      if (input.isMap(input.value)) {
        const v = input.value as unknown;
        let jsonObject: Record<string, unknown>;
        if (v instanceof Map) {
          jsonObject = Object.fromEntries(v as Map<string, unknown>);
        } else {
          const obj = v as Record<string, unknown>;
          jsonObject = Object.keys(obj).reduce<Record<string, unknown>>(
            (acc, k) => {
              acc[k] = obj[k];
              return acc;
            },
            {},
          );
        }
        input.value = jsonObject as SettingsValueType;
      }

      const setting = {
        name: input.id,
        value: input.value,
      } as Partial<PreparedSettings>;
      preparedSettings.push(setting);
    });
    return preparedSettings;
  }
}
