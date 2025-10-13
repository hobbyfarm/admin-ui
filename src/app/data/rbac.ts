export const verbs: Verb[] = [
  'list',
  'get',
  'create',
  'update',
  'delete',
  'watch',
];

export const resources: Resource[] = [
  'virtualmachines',
  'virtualmachineclaims',
  'virtualmachinetemplates',
  'environments',
  'virtualmachinesets',
  'courses',
  'scenarios',
  'sessions',
  'progresses',
  'accesscodes',
  'users',
  'scheduledevents',
  'dynamicbindrequests',
  'roles',
  'rolebindings',
  'scopes',
  'settings',
  'quizes',
];

export type Resource =
  | 'virtualmachines'
  | 'virtualmachineclaims'
  | 'virtualmachinetemplates'
  | 'environments'
  | 'virtualmachinesets'
  | 'courses'
  | 'scenarios'
  | 'sessions'
  | 'progresses'
  | 'accesscodes'
  | 'users'
  | 'scheduledevents'
  | 'dynamicbindrequests'
  | 'roles'
  | 'rolebindings'
  | 'scopes'
  | 'settings'
  | 'quizes'
  | '*';
export const isResource = (x: unknown): x is Resource =>
  typeof x === 'string' &&
  ([...resources, '*'] as ReadonlyArray<Resource>).includes(x as Resource);

export type Verb =
  | 'list'
  | 'get'
  | 'create'
  | 'update'
  | 'delete'
  | 'watch'
  | '*';
export const isVerb = (x: unknown): x is Verb =>
  typeof x === 'string' &&
  ([...verbs, '*'] as ReadonlyArray<Verb>).includes(x as Verb);
export type ApiGroup = 'rbac.authorization.k8s.io' | 'hobbyfarm.io';
export const rbacApiGroup: ApiGroup = 'rbac.authorization.k8s.io';
export const hobbyfarmApiGroup: ApiGroup = 'hobbyfarm.io';
