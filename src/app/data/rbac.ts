export const verbs: string[] = [
    "list",
    "get",
    "create",
    "update",
    "delete",
    "watch"
]

export const resources: string[] = [
    "virtualmachines",
    "virtualmachineclaims",
    "virtualmachinetemplates",
    "environments",
    "virtualmachinesets",
    "courses",
    "scenarios",
    "sessions",
    "progresses",
    "accesscodes",
    "users",
    "scheduledevents",
    "dynamicbindrequests",
    "roles",
    "rolebindings"
]

export type ApiGroup = "rbac.authorization.k8s.io" | "hobbyfarm.io";
export const rbacApiGroup: ApiGroup = "rbac.authorization.k8s.io";
export const hobbyfarmApiGroup: ApiGroup = "hobbyfarm.io";