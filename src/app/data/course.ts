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
    is_learnpath: boolean = false;
    is_learnpath_strict: boolean = false;
    in_catalog: boolean = false;
    header_image_path: string = '';
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
    is_learnpath: boolean;
    is_learnpath_strict: boolean;
    in_catalog: boolean;
    header_image_path: string;
}
