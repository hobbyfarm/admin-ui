export enum TypedInputTypes{
  STRING,
  NUMBER,
  BOOLEAN,
  ENUM
}

export class TypedInput {
  id: string;
  name: string;
  group: string;
  type: TypedInputTypes;
  value: any;
  enumValues?: string[];
}
