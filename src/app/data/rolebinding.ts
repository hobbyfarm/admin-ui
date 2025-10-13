export class RoleBinding {
  name: string;
  role: string;
  subjects: Subject[];
}

export class Subject {
  kind: string;
  name: string;
}
