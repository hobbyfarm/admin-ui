export enum TypedInputType {
  STRING,
  NUMBER,
  BOOLEAN,
  ENUM,
  // COLOR or other possible custom input types
}

export enum FormGroupType {
  LIST, // Display all settings in a grouped list
  TABS, // Group form inputs, display groups in tabs (default)
}

export class TypedInput {
  id: string; // id as of the metadata.name
  name: string; // Display name of the input
  group: string; // Group e.g. General, Provisioning etc.
  type: TypedInputType;
  value: any;
  enumValues?: string[]; // If this is of type ENUM this list provides allowed values
}
