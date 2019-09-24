import { Step } from './step';

export class Scenario {
    id: string;
    name: string;
    description: string;
    stepcount: number;
    virtualmachines: {}[];
    steps: Step[];
    keepalive_duration: string;
    pause_duration: string;
}