export class Environment {
    name: string;
    display_name: string;
    dnssuffix: string;
    provider: string;
    // e.g. "{ ubuntu1604-docker1: { "image": "ubuntu1604-docker1-base" } }"
    template_mapping: Record<string, Record<string, string>>;
    environment_specifics: {};
    ip_translation_map: {};
    ws_endpoint: string;
    capacity_mode: string;
    burst_capable: boolean;
    count_capacity: Map<string, number>;
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
    burst_count_capacity: Map<string, number>;
    burst_capacity: {
        cpu: number;
        memory: number;
        storage: number;
    }
}