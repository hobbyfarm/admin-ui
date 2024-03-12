import { ClrAlertType } from '../clr-alert-type';

export class AlertDetails {
    type: ClrAlertType;
    message: string;
    closable?: boolean = true;
    duration?: number = 0;
}