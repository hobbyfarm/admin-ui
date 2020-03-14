import { Scenario } from './scenario';

export class Course {
    id: string;
    name: string;
    description: string;
    virtualmachines: {}[];
    scenarios: Scenario[];
    keepalive_duration: string;
    pause_duration: string;
}
