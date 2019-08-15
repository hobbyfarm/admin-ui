export class EnvironmentAvailability {
    environment: string;
    capacity_mode: string;
    available_count: Map<string, number>;
    available_capacity: {
        cpu: number;
        memory: number;
        storage: number;
    }
}