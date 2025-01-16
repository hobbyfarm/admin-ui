// detailed-cost-chart.component.ts
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DetailedCost, DetailedCostSource } from 'src/app/data/cost';
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'monthly-cost-chart',
  templateUrl: './monthly-cost-chart.component.html',
  styleUrls: ['./monthly-cost-chart.component.scss'],
})
export class MonthlyCostChartComponent implements OnInit, OnChanges {
  @Input() data: DetailedCost | undefined;

  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day', // Adjust the unit based on your data (e.g., 'hour', 'day', 'minute')
          displayFormats: {
            hour: 'MMM d, HH:mm', // Custom format for the time
          },
        },
        title: { display: true, text: 'Time' },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Cost' },
      },
    },
  };

  public lineChartType: ChartType = 'line';

  ngOnInit(): void {
    if (this.data) {
      this.initializeChart();
    }
  }

  ngOnChanges(): void {
    if (this.data) {
      this.initializeChart();
    }
  }

  initializeChart() {
    if (!this.data) {
      return;
    }

    const { source } = this.data;

    // Step 1: Extract all unique timestamps
    const timestamps = new Set<number>();
    source.forEach((s) => {
      timestamps.add(s.creation_unix_timestamp);
      if (s.deletion_unix_timestamp) {
        timestamps.add(s.deletion_unix_timestamp);
      }
    });
    timestamps.add(Math.floor(Date.now() / 1000)); // Add current time

    // Step 2: Sort timestamps in ascending order
    const sortedTimestamps = Array.from(timestamps).sort((a, b) => a - b);

    const chartData = this.getAccumulatedData(sortedTimestamps);

    // Step 4: Update chart data
    this.lineChartData = {
      labels: sortedTimestamps.map((ts) => new Date(ts * 1000)),
      datasets: [
        {
          label: 'Accumulated Cost',
          data: chartData,
          fill: false,
          tension: 0.4,
        },
      ],
    };
  }

  /**
   * Calculate the cost for a given time interval based on time unit and base price.
   * @param source The DetailedCostSource object.
   * @param timeDelta The time interval in seconds.
   * @returns The cost for the interval.
   */
  calculateIntervalCost(source: DetailedCostSource, timeDelta: number): number {
    const timeUnitToSeconds = {
      seconds: 1,
      minutes: 60,
      hours: 3600,
    };

    const unitInSeconds = timeUnitToSeconds[source.time_unit.toLowerCase()];
    if (!unitInSeconds) {
      throw new Error(`Unsupported time unit: ${source.time_unit}`);
    }

    const intervals = Math.ceil(timeDelta / unitInSeconds);
    return intervals * source.base_price;
  }

  getAccumulatedData(timestamps: number[]): number[] {
    if (!this.data) {
      return [];
    }
    const { source } = this.data;
    // Step 3: Initialize accumulated costs
    const accumulatedCosts: number[] = [];
    let runningTotal = 0;

    timestamps.forEach((timestamp, index) => {
      if (index > 0) {
        const prevTimestamp = timestamps[index - 1];
        const timeDelta = timestamp - prevTimestamp; // In seconds

        // Calculate cost for the time interval
        source.forEach((s) => {
          if (
            prevTimestamp >= s.creation_unix_timestamp &&
            (!s.deletion_unix_timestamp ||
              prevTimestamp < s.deletion_unix_timestamp)
          ) {
            runningTotal += this.calculateIntervalCost(s, timeDelta);
          }
        });
      }
      accumulatedCosts.push(runningTotal);
    });

    return accumulatedCosts;
  }
}
