import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ClrModal } from '@clr/angular';

@Component({
  selector: 'delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent implements OnInit {
  public modalOpen: boolean = false;

  @Output()
  public delete: EventEmitter<boolean> = new EventEmitter(null);

  constructor() { }

  @ViewChild("modal") modal: ClrModal;

  ngOnInit(): void {
  }

  open(): void {
    this.modal.open();
  }

  doDelete(): void {
    this.delete.emit(true);
    this.modal.close();
  }
}
