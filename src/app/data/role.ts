export class Role {
    name: string;
    rules: Rule[];
}

export class Rule {
    verbs: string[];
    apiGroups: string[];
    resources: string[];
}