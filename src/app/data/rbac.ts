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
  | '*';
export const isResource = (x: any): x is Resource =>
  [...resources, '*'].includes(x);
export type Verb =
  | 'list'
  | 'get'
  | 'create'
  | 'update'
  | 'delete'
  | 'watch'
  | '*';
export const isVerb = (x: any): x is Verb => [...verbs, '*'].includes(x);
export type ApiGroup = 'rbac.authorization.k8s.io' | 'hobbyfarm.io';
export const rbacApiGroup: ApiGroup = 'rbac.authorization.k8s.io';
export const hobbyfarmApiGroup: ApiGroup = 'hobbyfarm.io';
