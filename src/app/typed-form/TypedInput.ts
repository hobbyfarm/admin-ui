export enum TypedInputType {
  STRING,
  INTEGER,
  FLOAT,
  BOOLEAN,
  ENUM,
  // COLOR or other possible custom input types
}

export enum FormGroupType {
  LIST, // Display all settings in a grouped list
  TABS, // Group form inputs, display groups in horizontal tabs (default)
  TABS_VERTICAL, // Group form inputs, display groups in vertical tabs
}

export class TypedInput {
  id: string; // id as of the metadata.name
  name: string; // Display name of the input
  categories: string[]; // Category e.g. General, Provisioning etc.
  type: TypedInputType;
  value: any;
  enumValues?: string[]; // If this is of type ENUM this list provides allowed values
}
