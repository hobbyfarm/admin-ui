import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { tap } from "rxjs";

  
@Component({
    selector: 'app-terminal-view',
    templateUrl: './terminal-view.component.html',
    styleUrls: ['terminal-view.component.scss'],
})
export class TerminalViewComponent { 
     public vmid = ''
     public endpoint = ''
     public vmname = ''
  
    constructor(public route: ActivatedRoute) {}


    ngOnInit() {   
        this.route.params.pipe(
            tap((params: Params) => {
            console.log("tapping params...")
            this.vmname = params['vmName'];
            this.vmid = params['vmId'];
            this.endpoint = params['wsEndpoint'];
            console.log("params: ", this.vmid, " ", this.endpoint," ", this.vmname," ", params)
            })).subscribe();   
    }
}