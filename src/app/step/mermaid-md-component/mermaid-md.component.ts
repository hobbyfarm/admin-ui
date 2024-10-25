import { Component, Input, OnInit } from "@angular/core";
import mermaid, { RenderResult } from 'mermaid';
import { uniqueString } from "src/app/utils";


@Component({
    selector: 'app-mermaid-md',
    templateUrl: './mermaid-md.component.html',
    styleUrls: ['./mermaid-md.component.scss'],
  })
  export class MermaidMdComponent implements OnInit {
    @Input() code: string;
    public svgContent: Promise<RenderResult>

    ngOnInit(): void {
      mermaid.initialize({
        startOnLoad: false,
      });
      const n = 5;
      const uniqueSvgId = `svg-mermaid-${uniqueString(n)}`
      this.svgContent = mermaid.render(uniqueSvgId, this.code);
    }
  }