import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'app-note-md',
  templateUrl: './note-md.component.html',
  styleUrls: ['./note-md.component.scss'],
})
export class NoteMdComponent implements OnChanges {
  @Input() noteType: string;
  @Input() message: string;
  @Input() code: string;
  parsedContent: Promise<string>;

  constructor(private markdownService: MarkdownService) {}
  ngOnChanges(): void {
    this.parsedContent = Promise.resolve(this.markdownService.parse(this.code));
  }
}