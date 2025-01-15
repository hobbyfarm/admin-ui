import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {
  extractResponseContent,
  GargantuaClientFactory,
  ResourceClient,
} from './gargantua.service';
import { Cost } from './cost';
import { ServerResponse } from './serverresponse';

@Injectable({
  providedIn: 'root',
})
export class CostService extends ResourceClient<Cost> {
  private detailedGarg = this.gcf.scopedClient('/a/cost/detail/');
  private listGarg = this.gcf.scopedClient('/a/cost');

  constructor(private gcf: GargantuaClientFactory) {
    super(gcf.scopedClient('/a/cost'));
  }

  // Get Current and historical costs
  public allCostForGroup(cost_group: string) {
    return this.garg
      .get('/all/' + cost_group)
      .pipe(map(extractResponseContent));
  }

  // Only retreive the current costs
  public currentCostForGroup(cost_group: string) {
    return this.garg
      .get('/present/' + cost_group)
      .pipe(map(extractResponseContent));
  }

  // Only retreive costs that are not active anymore
  public historicalCostForGroup(cost_group: string) {
    return this.garg
      .get('/history/' + cost_group)
      .pipe(map(extractResponseContent));
  }

  // Retreive with more details about where the cost came from
  public detailedCostForGroup(cost_group: string) {
    return this.detailedGarg
      .get<ServerResponse>(cost_group)
      .pipe(map(extractResponseContent));
  }

  // Retreive all costs over all cost groups
  public list() {
    return this.listGarg
      .get<ServerResponse>('/list')
      .pipe(map(extractResponseContent));
  }
}
