// For freshly created scheduled events, start_time or end_time might be undefined
import { SharedVirtualMachine } from "./sharedvm";

export class ScheduledEventBase {
  id: string;
  creator: string;
  event_name: string;
  description: string;
  start_time: Date | null = null;
  end_time: Date | null = null;
  // Maps from (envName, vmTemplateName) to vmCount
  required_vms: Record<string, Record<string, number>>;
  scenarios: string[];
  courses: string[];
  vmsets: string[];
  active: boolean;
  provisioned: boolean;
  ready: boolean;
  finished: boolean;
  access_code: string;
  disable_restriction: boolean;
  on_demand: boolean;
  printable: boolean;
  activeSessions: number;
  shared_vms: SharedVirtualMachine[];
}

// start_time or end_time must be defined for scheduled events returned by our backend
export class ScheduledEvent extends ScheduledEventBase {
  start_time!: Date;
  end_time!: Date;
}

export interface DashboardScheduledEvent extends ScheduledEvent {
  creatorEmail?: string;
  provisionedVMs?: number;
}
