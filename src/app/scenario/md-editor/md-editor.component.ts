import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { ACTIONS, MDEditorAction } from './markdownActions';

@Component({
  selector: 'md-editor',
  templateUrl: './md-editor.component.html',
  styleUrls: ['./md-editor.component.scss'],
})
export class MDEditorComponent implements OnChanges, AfterViewInit {
  @Input()
  public content: string = '';
  @Output()
  public contentChange: EventEmitter<string> = new EventEmitter<string>();

  readonly ACTIONS = ACTIONS;

  constructor() {}

  @ViewChild('mdEditor') mdEditor: ElementRef;

  ngAfterViewInit(): void {
    this.mdEditor.nativeElement.addEventListener('input', () => {
      this.inputChanged();
    });
  }

  ngOnChanges(): void {
    this.delayedResizeEditor();
  }

  resizeEditor() {
    this.mdEditor.nativeElement.style.height = 'auto';
    this.mdEditor.nativeElement.style.height =
      this.mdEditor.nativeElement.scrollHeight + 'px';
  }

  inputChanged() {
    if (!this.mdEditor) {
      return;
    }
    this.resizeEditor();
    this.emitEvent();
  }

  delayedResizeEditor() {
    setTimeout(() => this.resizeEditor(), 0);
  }

  editorPreset(action: MDEditorAction) {
    let cursorPosition: number = this.mdEditor.nativeElement.selectionStart;
    let selectionEnd: number = this.mdEditor.nativeElement.selectionEnd;
    let textBefore = this.mdEditor.nativeElement.value.substring(
      0,
      cursorPosition
    );
    let textAfter = this.mdEditor.nativeElement.value.substring(selectionEnd);
    let textSelection = this.mdEditor.nativeElement.value.substring(
      cursorPosition,
      selectionEnd
    );
    if (cursorPosition == selectionEnd) {
      // No text was selected, only cursor position is set
      textSelection = action.actionEmpty; // We set a default text
      selectionEnd += action.actionEmpty.length; // and move the selection so that the default text is selected
    }
    let newText =
      textBefore +
      action.actionBefore +
      textSelection +
      action.actionAfter +
      textAfter; // Merge all parts together
    this.mdEditor.nativeElement.value = newText;
    this.content = newText;
    this.mdEditor.nativeElement.focus();
    this.mdEditor.nativeElement.selectionStart =
      cursorPosition + action.actionBefore.length; // Cursor selection will move by the added length
    this.mdEditor.nativeElement.selectionEnd =
      selectionEnd + action.actionBefore.length; // as for the end of the selection
    this.emitEvent();
  }

  emitEvent() {
    this.contentChange.emit(this.content);
  }
}
