export enum TypedInputTypes{
  STRING,
  NUMBER,
  BOOLEAN,
  ENUM,
  // COLOR or other possible custom input types
}

export class TypedInput {
  id: string; // id as of the metadata.name
  name: string; // Display name of the input
  group: string; // Group e.g. General, Provisioning etc.
  type: TypedInputTypes;
  value: any;
  enumValues?: string[]; // If this is of type ENUM this list provides allowed values
}
