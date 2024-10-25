import { Component, Input } from "@angular/core";


@Component({
    selector: 'app-note-md',
    templateUrl: './note-md.component.html',
    styleUrls: ['./note-md.component.scss'],
  })
  export class NoteMdComponent {
    @Input() type: string;
    @Input() message: string;
    @Input() parsedContent: Promise<string>;
  }