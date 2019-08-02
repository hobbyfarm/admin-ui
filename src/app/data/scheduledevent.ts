export class ScheduledEvent {
    id: string;
    creator: string;
    event_name: string;
    description: string;
    start_time: Date;
    end_time: Date;
    required_vms: Map<string, Map<string, number>>;
    scenarios: string[];
    vmsets: string[];
    active: boolean;
    provisioned: boolean;
    read: boolean;
    finished: boolean;
    access_code: string;
}