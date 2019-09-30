export class Environment {
    display_name: string;
    dnssuffix: string;
    provider: string;
    template_mapping: Map<string,Map<string, string>>; // "{ ubuntu1604-docker1: { "image": "ubuntu1604-docker1-base" } }"
    environment_specifics: Map<string, string>;
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