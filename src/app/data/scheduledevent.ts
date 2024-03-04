export class ScheduledEvent {
  id: string;
  creator: string;
  event_name: string;
  description: string;
  start_time: Date;
  end_time: Date;
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
}

export interface DashboardScheduledEvent extends ScheduledEvent {
  creatorEmail?: String;
  provisionedVMs?: number;
}
