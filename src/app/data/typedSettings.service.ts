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
    if (this.cachedTypedInputList.has(scope)) {
      return of(this.cachedTypedInputList.get(scope).get(setting));
    } else {
      return this.list(scope).pipe(
        tap((typedInputs: TypedInput[]) => {
          let m: Map<string, TypedInput> = new Map();
          typedInputs.forEach((typedSetting) => {
            m.set(typedSetting.id, typedSetting);
          });
          this.cachedTypedInputList.set(scope, m);
        }),
        map(typedInputs => {
          return typedInputs.find(typedInput => {
            return typedInput.id === setting;
          })
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
      })
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
      })
    );
  }

  private buildTypedInputList(pList: PreparedSettings[]) {
    let settings: TypedInput[] = [];

    pList.forEach((preparedSetting: PreparedSettings) => {
      const typedInputRepresentationIndex =
        this.typedInputRepresentationStringList.indexOf(
          preparedSetting.valueType
        );
      const representation: TypedInputRepresentation =
        this.typedInputRepresentationList[
          typedInputRepresentationIndex == -1
            ? 0
            : typedInputRepresentationIndex
        ];

      const typedInputTypeIndex = this.typedInputDataTypeStringList.indexOf(
        preparedSetting.dataType
      );
      const inputType: TypedInputType =
        this.typedInputDataTypeList[
          typedInputTypeIndex == -1 ? 0 : typedInputTypeIndex
        ];

      // TODO 08.06.2023
      // Converting scalar strings will result in escaped characters, we have to parse the value once again
      if (
        inputType == TypedInputType.STRING &&
        representation == TypedInputRepresentation.SCALAR
      ) {
        //preparedSetting.value = JSON.parse(preparedSetting.value);
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

  private buildPreparedSettingsList(inputs: TypedInput[]) {
    let preparedSettings: Partial<PreparedSettings>[] = [];
    inputs.forEach((input: TypedInput) => {
      // Maps will not be converted correctly with JSON.stringify, we have to convert them to an Object.
      if (input.representation == TypedInputRepresentation.MAP) {
        let jsonObject = {};
        input.value.forEach((value, key) => {
          jsonObject[key] = value;
        });
        input.value = jsonObject;
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
