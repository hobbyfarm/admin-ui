export class VMTemplate {
    id: string;
    name: string;
    image: string;
    resources: {
        cpu: number;
        memory: number;
        storage: number;
    };
    count_map: any;
}