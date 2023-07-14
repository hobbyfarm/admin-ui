import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import 'prismjs'
import 'prismjs/components/prism-yaml'

declare var Prism: any;

@Component({
  selector: 'app-code-with-syntax-highlighting',
  templateUrl: './code-with-syntax-highlighting.component.html',
  styleUrls: ['./code-with-syntax-highlighting.component.scss']
})
export class CodeWithSyntaxHighlightingComponent implements AfterViewInit, OnDestroy {

  @Input()
  textValue: string;

  @Output()
  textChanged: EventEmitter<string> = new EventEmitter<string>()

  @ViewChild('codeEditor')
  codeEditor: ElementRef

  @ViewChild('code')
  codeBlock: ElementRef;

  @ViewChild('textarea')
  textarea: ElementRef;

  public highlightedText: string;

  private observer = new MutationObserver(() => this.resize())

  ngAfterViewInit() {
    this.setHighlightedText(this.textValue)
    this.observer.observe(this.textarea.nativeElement, {attributes: true})
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

  resizeEvent(event) {
    this.codeEditor.nativeElement.style.height = event.height + 'px'
    this.codeBlock.nativeElement.style.height = event.height + 'px'
  }

  resize() {
    const scrollHeight = this.textarea.nativeElement.scrollHeight
    if (scrollHeight > 0) {
      this.resizeEvent({height: scrollHeight})
    }
  }

  ngOnDestroy() {
    this.observer.disconnect()
  }
}


