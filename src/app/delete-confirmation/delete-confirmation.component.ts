import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { ClrModal } from '@clr/angular';

@Component({
  selector: 'delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
})
export class DeleteConfirmationComponent {
  public modalOpen: boolean = false;

  @Output()
  public delete: EventEmitter<boolean> = new EventEmitter(null);

  @ViewChild("modal") modal: ClrModal;

  ngOnInit(): void {
  }

  public open(): void {
    this.modal.open();
  }

  doDelete(): void {
    this.delete.emit(true);
    this.modal.close();
  }
}
