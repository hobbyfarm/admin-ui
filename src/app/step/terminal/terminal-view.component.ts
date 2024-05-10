import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { tap } from "rxjs";

  
@Component({
    selector: 'app-terminal-view',
    templateUrl: './terminal-view.component.html',
    styleUrls: ['terminal-view.component.scss'],
})
export class TerminalViewComponent { //implements OnInit {
     public vmid = ''//'shared-se-se-lid2eoudic-132593ea'; //dynamic-l5jw4t5ksn-50c998fb
     public endpoint = ''//'shell-i5-hb.sva.dev';
     public vmname = ''//'Test';
  
    constructor(public route: ActivatedRoute) {}


    ngOnInit() {
    //    if(!this.vmid && !this.endpoint) {
        this.route.params.pipe(
            tap((params: Params) => {
            console.log("tapping params...")
            this.vmname = 'Testing';
            this.vmid = params['vmId'];
            this.endpoint = params['wsEndpoint'];
            console.log("params: ", this.vmid, " ", this.endpoint)
            })).subscribe();
    //    }
    }
}