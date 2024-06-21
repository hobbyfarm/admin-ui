import { Step } from './step';
import { VMTasks } from './vm-tasks';

export class Scenario {
    id: string;
    name: string;
    description: string;
    stepcount: number;
    virtualmachines: {}[];
    steps: Step[];
    categories: string[];
    tags: string[];
    keepalive_duration: string;
    pause_duration: string;
    pauseable: boolean;
    vm_tasks: VMTasks[]
}