import { ApiGroup, Resource, Verb } from './rbac';

export class Role {
    name: string;
    rules: Rule[];
}

export class Rule {
    verbs: Verb[];
    apiGroups: ApiGroup[];
    resources: Resource[];
}