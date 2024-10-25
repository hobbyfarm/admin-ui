import { Component, Input } from "@angular/core";


@Component({
    selector: 'app-hidden-md',
    templateUrl: './hidden-md.component.html',
    styleUrls: ['./hidden-md.component.scss'],
  })
  export class HiddenMdComponent {
    @Input() summary: string;
    @Input() parsedContent: Promise<string>;
  }