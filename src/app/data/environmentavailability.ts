export class EnvironmentAvailability {
    environment: string;
    capacity_mode: string;
    available_count: {};
    available_capacity: {
        cpu: number;
        memory: number;
        storage: number;
    }
}