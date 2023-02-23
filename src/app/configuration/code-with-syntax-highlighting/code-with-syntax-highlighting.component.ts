import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import 'prismjs'
import 'prismjs/components/prism-yaml'
import { of } from 'rxjs';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

declare var Prism: any;

@Component({
  selector: 'app-code-with-syntax-highlighting',
  templateUrl: './code-with-syntax-highlighting.component.html',
  styleUrls: ['./code-with-syntax-highlighting.component.scss']
})
export class CodeWithSyntaxHighlightingComponent implements AfterViewInit {

  @Input()
  textValue: string;

  @Output()
  textChanged: EventEmitter<string> = new EventEmitter<string>()

  public highlightedText: string;

  ngAfterViewInit() {
    this.setHighlightedText(this.textValue)
  }

  setHighlightedText(textValue) {
    this.highlightedText = Prism.highlight(textValue, Prism.languages.yaml, 'yaml')
  }

  ngOnChanges(changes: SimpleChanges) {
    this.textValue = changes.textValue.currentValue
    this.setHighlightedText(changes.textValue.currentValue)
  }

  onValueChange(event) {
    let newText: string = event.target.value
    this.textChanged.emit(newText)
  }
}
