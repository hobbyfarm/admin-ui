export class Environment {
    display_name: string;
    dnssuffix: string;
    provider: string;
    template_mapping: Map<string,Map<string, string>>; // "{ ubuntu1604-docker1: { "image": "ubuntu1604-docker1-base" } }"
    environment_specifics: {
        cred_secret: string;
        executor_image: string;
        module: string;
        vcenter: string;
        vsphere_cluster: string;
        vsphere_datacenter: string;
        vsphere_datastore: string;
        vsphere_network: string;
        vsphere_resource_pool: string;
    };
    ip_translation_map: Map<string, string>;
    ws_endpoint: string;
    capacity_mode: string;
    count_capacity: {
        cpu: number;
        memory: number;
        storage: number;
    };
    capacity: {
        cpu: number;
        memory: number;
        storage: number;
    };
    used: {
        cpu: number;
        memory: number;
        storage: number;
    };
    available_count: number;
}