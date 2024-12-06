import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import 'prismjs';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-regex';

declare var Prism: any;

export enum supportedLanguages { //To allow for more Languages the prism Components have to be imported also. For a list of all Supported Languages see: https://prismjs.com/#supported-languages
  YAML = 'language-yaml',
  BASH = 'language-bash',
  REGEX = 'language-regex',
}

@Component({
  selector: 'app-code-with-syntax-highlighting',
  templateUrl: './code-with-syntax-highlighting.component.html',
  styleUrls: ['./code-with-syntax-highlighting.component.scss'],
})
export class CodeWithSyntaxHighlightingComponent
  implements AfterViewInit, OnDestroy
{
  @Input('textValue') set textValue(value: string) {
    this._textValue = value;
    this.count++
    if (!this.resizeable) {
      this.previousScrollHeight = 0;
      this.setStyleValues();
    }
  }

  count: number = 0

  _textValue: string = '';

  @Input()
  height: string = '500px';

  @Input()
  width: string = '100%';

  @Input()
  resizeable: boolean = false;

  @Input()
  readonly: boolean = false;

  @Input()
  outline: string = 'solid 1px';

  @Input()
  language: supportedLanguages = supportedLanguages.YAML;

  private lang: string = 'yaml';

  @Output()
  textChanged: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('codeEditor')
  codeEditor: ElementRef;

  @ViewChild('code')
  codeBlock: ElementRef;

  @ViewChild('textarea')
  textarea: ElementRef;

  public highlightedText: string;

  private observer = new MutationObserver(() => {
    this.resize();
  });
  private previousScrollHeight = 0;

  private initialized: boolean = false; // Prevent Errors when Parent sets the text before initialization, i.e. in a clarity accordeon element.

  ngAfterViewInit() {
    this.initialized = true
    this.setStyleValues();
    this.lang = this.language.split('-')[1];
    this.setHighlightedText(this._textValue);
    this.observer.observe(this.textarea.nativeElement, { attributes: true });
  }

  setStyleValues() {
    if (!!this.initialized) {
      this.codeEditor.nativeElement.style.outline = this.outline;
      this.codeEditor.nativeElement.style.height = this.height;
      this.codeEditor.nativeElement.style.width = this.width;
      this.codeEditor.nativeElement.style.maxWidth = this.width;
      this.codeBlock.nativeElement.style.height = this.height;
      this.textarea.nativeElement.style.height = this.height;
      this.textarea.nativeElement.style.resize = this.resizeable
        ? 'vertical'
        : 'none';
    }
  }

  setHighlightedText(textValue) {
    this.highlightedText = Prism.highlight(
      textValue,
      Prism.languages[this.lang],
      this.lang
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.textValue) {
      this._textValue = changes.textValue.currentValue;
      this.setHighlightedText(changes.textValue.currentValue);
    }
  }

  onValueChange(event) {
    this.count++
    let newText: string = event.target.value;
    this.textChanged.emit(newText);
  }

  manualResizeEvent(event) {
    if (this.previousScrollHeight > event.height) {
      this.previousScrollHeight = event.height;
    }
    this.resizeEvent(event);
  }

  resizeEvent(event) {
    let newHeight = event.height + 'px';
    this.codeEditor.nativeElement.style.height = newHeight;
    this.codeBlock.nativeElement.style.height = newHeight;
    this.textarea.nativeElement.style.height = newHeight;
  }

  resize() {
    const scrollHeight = this.textarea.nativeElement.scrollHeight;
    if (scrollHeight > 0 && scrollHeight > this.previousScrollHeight) {
      this.previousScrollHeight = scrollHeight;
      if (!this.resizeable) {
        this.textarea.nativeElement.style.height = 0;
      }
      this.resizeEvent({ height: scrollHeight, isResize: true });
    }
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}