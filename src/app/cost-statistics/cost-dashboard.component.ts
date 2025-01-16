import { Component, OnChanges, OnInit } from '@angular/core';
import { CostService } from 'src/app/data/cost.service';
import { Cost } from 'src/app/data/cost';

@Component({
  selector: 'cost-statistics',
  templateUrl: './cost-dashboard.component.html',
  styleUrls: ['./cost-dashboard.component.scss'],
})
export class CostStatisticsComponent implements OnInit {
  constructor(public costService: CostService) {}

  public currencySymbol: string = '$';
  public allCost: Cost = new Cost();
  public costs: Cost[];
  public normalizedCost: number = 0;

  ngOnInit(): void {
    this.costService.list().subscribe((c: Cost[]) => {
      console.log(c);
      this.allCost = this.accumulateCosts(c);
      this.costs = c;
    });
  }

  private accumulateCosts(costs: Cost[]): Cost {
    const accumulated: Cost = {
      cost_group: 'All Events', // Group name for the accumulated cost
      total: 0,
      source: [],
    };

    const sourceMap: { [kind: string]: { cost: number; count: number } } = {};

    costs.forEach((cost) => {
      // Accumulate the total
      accumulated.total += cost.total;

      // Accumulate the source details
      cost.source.forEach((source) => {
        if (!sourceMap[source.kind]) {
          sourceMap[source.kind] = { cost: 0, count: 0 };
        }
        sourceMap[source.kind].cost += source.cost;
        sourceMap[source.kind].count += source.count;
      });
    });

    // Convert the sourceMap back to an array of CostSource
    accumulated.source = Object.keys(sourceMap).map((kind) => ({
      kind,
      cost: sourceMap[kind].cost,
      count: sourceMap[kind].count,
    }));

    return accumulated;
  }
}
