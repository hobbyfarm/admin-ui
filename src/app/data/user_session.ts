export class UserSession {
    scheduledevent_id: string; 
    user_id: string;
    scenario_id: string;
    course_id: string;
    current_step: bigint;
    max_step: bigint;
    total_steps: bigint;
    finished: boolean
    last_update: Date;
    started: Date; 
}