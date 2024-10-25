import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-terminal-view',
  templateUrl: './terminal-view.component.html',
  styleUrls: ['terminal-view.component.scss'],
})
export class TerminalViewComponent {
  public vmid = '';
  public vmname = '';


  constructor(
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    //get the query params from the route
    const queryParams = this.route.snapshot.queryParams;
    this.vmname = queryParams['vmName'];
    this.vmid = queryParams['vmId'];
  }
}
