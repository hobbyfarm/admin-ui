export class VMTemplate {
    id: string;
    name: string;
    image: string;
    resources: {
        cpu: number;
        memory: number;
        storage: number;
    };
    config_map: any;
}