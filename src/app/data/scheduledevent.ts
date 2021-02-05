export class ScheduledEvent {
    id: string;
    creator: string;
    event_name: string;
    description: string;
    start_time: Date;
    end_time: Date;
    required_vms: {};
    scenarios: string[];
    courses: string[];
    vmsets: string[];
    active: boolean;
    provisioned: boolean;
    read: boolean;
    finished: boolean;
    access_code: string;
    disable_restriction: boolean;
    on_demand: boolean;
}
