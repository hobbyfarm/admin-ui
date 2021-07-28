import { Component, OnInit, ViewChild } from '@angular/core';
import { ClrAlert } from '@clr/angular';
import { ClrAlertType } from '../clr-alert-type';

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  public isClosed: boolean = true;
  public text: string = "";

  @ViewChild("clrAlert") alert: ClrAlert;

  constructor() { }

  ngOnInit(): void {
  }

  public close() {
    this._close();
  }

  public error(text: string, closable: boolean = true, timeout: number = 0) {
    this.doAlert(text, ClrAlertType.Error, closable, timeout)
  }

  public info(text: string, closable: boolean = true, timeout: number = 0) {
    this.doAlert(text, ClrAlertType.Info, closable, timeout)
  }

  public success(text: string, closable: boolean = true, timeout: number = 0) {
    this.doAlert(text, ClrAlertType.Success, closable, timeout)
  }

  public warning(text: string, closable: boolean = true, timeout: number = 0) {
    this.doAlert(text, ClrAlertType.Warning, closable, timeout)
  }

  private doAlert(text: string, type: ClrAlertType = ClrAlertType.Info, closable: boolean = true, timeout: number = 0) {
    this.alert.alertType = type;
    this.text = text;
    this.alert.closable = closable;

    this._open();
    
    if (timeout > 0) {
      setTimeout(() => this._close(), timeout)
    }
  }

  private _open() {
    this.isClosed = false;
  }

  private _close() {
    this.isClosed = true;
  }
}
