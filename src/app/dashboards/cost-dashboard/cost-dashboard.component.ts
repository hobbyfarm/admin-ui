import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ScheduledEventBase } from 'src/app/data/scheduledevent';
import { CostService } from 'src/app/data/cost.service';
import {
  Cost,
  CostSource,
  DetailedCost,
  DetailedCostSource,
} from 'src/app/data/cost';

@Component({
  selector: 'cost-dashboard',
  templateUrl: './cost-dashboard.component.html',
  styleUrls: ['./cost-dashboard.component.scss'],
})
export class CostDashboardComponent implements OnChanges {
  @Input()
  selectedEvent: ScheduledEventBase;

  constructor(public costService: CostService) {}

  public currencySymbol: string = '$';
  public allCost: Cost = new Cost();
  public currentCost: Cost = new Cost();
  public historicalCost: Cost = new Cost();

  public detailedCost?: DetailedCost;
  public loading: boolean = false;

  ngOnChanges(): void {
    if (this.selectedEvent) {
      this.detailedCost = undefined;

      this.costService.allCostForGroup(this.selectedEvent.id).subscribe({
        next: (cost: Cost) => {
          this.allCost = cost;
        },
        error: () => {
          this.allCost = new Cost();
          this.allCost.total = 0;
        },
      });

      this.costService.historicalCostForGroup(this.selectedEvent.id).subscribe({
        next: (cost: Cost) => {
          this.historicalCost = cost;
        },
        error: () => {
          this.historicalCost = new Cost();
          this.historicalCost.total = 0;
        },
      });

      this.costService.currentCostForGroup(this.selectedEvent.id).subscribe({
        next: (cost: Cost) => {
          this.currentCost = cost;
        },
        error: () => {
          this.currentCost = new Cost();
          this.currentCost.total = 0;
        },
      });
    }
  }

  onAccordionToggle(expanded: boolean): void {
    if (expanded) {
      this.fetchDetailedCost();
    }
  }

  getDetailedCostForKind(kind: string) {
    if (!this.detailedCost) {
      return [];
    }
    return this.filterCostsByKind(this.detailedCost.source, kind);
  }

  calculateRunningTime(
    creationUnixTimestamp: number,
    deletionUnixTimestamp?: number,
  ): string {
    const creationTime = new Date(creationUnixTimestamp * 1000); // Convert to milliseconds
    const endTime = deletionUnixTimestamp
      ? new Date(deletionUnixTimestamp * 1000)
      : new Date(); // Use current time if deletion timestamp is not provided

    const timeDifferenceInSeconds = Math.floor(
      (endTime.getTime() - creationTime.getTime()) / 1000,
    );

    // Calculate time in various units
    const days = Math.floor(timeDifferenceInSeconds / (24 * 3600));
    const hours = Math.floor((timeDifferenceInSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((timeDifferenceInSeconds % 3600) / 60);
    const seconds = timeDifferenceInSeconds % 60;

    // Return a formatted string
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  calculateSourceCost(source: DetailedCostSource): number {
    const creationTime = new Date(source.creation_unix_timestamp * 1000); // Convert to milliseconds
    const endTime = source.deletion_unix_timestamp
      ? new Date(source.deletion_unix_timestamp * 1000)
      : new Date(); // Use current time if deletion timestamp is not provided

    const timeDifferenceInSeconds = Math.ceil(
      (endTime.getTime() - creationTime.getTime()) / 1000,
    );

    // Convert time difference to the appropriate unit
    let timeUnits: number;
    switch (source.time_unit) {
      case 'seconds':
        timeUnits = timeDifferenceInSeconds;
        break;
      case 'minutes':
        timeUnits = Math.ceil(timeDifferenceInSeconds / 60);
        break;
      case 'hours':
        timeUnits = Math.ceil(timeDifferenceInSeconds / 3600);
        break;
      default:
        throw new Error(`Invalid time unit: ${source.time_unit}`);
    }

    // Calculate the total cost
    return source.base_price * timeUnits;
  }

  private fetchDetailedCost(): void {
    if (this.detailedCost) {
      return;
    }

    this.loading = true;
    this.costService.detailedCostForGroup(this.selectedEvent.id).subscribe(
      (data: DetailedCost) => {
        this.detailedCost = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching detailed cost:', error);
        this.loading = false;
      },
    );
  }

  private filterCostsByKind(
    sources: DetailedCostSource[],
    kind: string,
  ): DetailedCostSource[] {
    return sources.filter((source) => source.kind === kind);
  }
}
