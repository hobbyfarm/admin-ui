import { Scenario } from './scenario';

export class Course {
    id: string;
    name: string;
    description: string;
    virtualmachines: Record<string, string>[];
    scenarios: Scenario[];
    categories: string[];
    keepalive_duration?: string;
    pause_duration?: string;
    pauseable: boolean;
    keep_vm: boolean;
}

export class CourseApi {
    id: string;
    name: string;
    description: string;
    virtualmachines: Record<string, string>[];
    scenarios: string[];
    categories: string[];
    keepalive_duration?: string;
    pause_duration?: string;
    pauseable: boolean;
    keep_vm: boolean;
}
