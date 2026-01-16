import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { SettingsService } from '../data/settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'interval-timer',
  templateUrl: './interval-timer.component.html',
  styleUrls: ['./interval-timer.component.scss'],
})
export class IntervalTimerComponent implements OnInit, OnDestroy {
  // Output to emit an Event everytime the Timer reaches 0
  @Output()
  intervalElapsed: EventEmitter<void> = new EventEmitter();

  // Optional parameter to define the interval times that are needed in the parent Component. This overwrites the default of 10, 30, 60, 120 and 300 seconds if provided
  @Input()
  delayOptions: number[] = [10, 30, 60, 120, 300];

  // Optional parameter to provide another label for the Timer Component than "Refresh Rate"
  @Input()
  label: string = 'Refresh Rate';

  public callInterval: ReturnType<typeof setInterval> | null = null;
  public currentCallDelay: number;
  public circleVisible: boolean = true;
  private settingsSubscription: Subscription;
  private defaultInterval: number = 30;

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settingsSubscription = this.settingsService.settings$.subscribe(
      ({ refresh_timer_interval }) => {
        this.currentCallDelay = this.settingsDelayOrDefault(
          refresh_timer_interval,
        );
        this.startTimer();
      },
    );
  }

  onTimerClick(): void {
    this.changeDelay();
    this.intervalElapsed.emit();

    this.settingsService
      .update({ refresh_timer_interval: this.currentCallDelay })
      .subscribe();
  }

  changeDelay(): void {
    this.currentCallDelay = this.nextHigherOrFirst(this.currentCallDelay);
    this.startTimer();
  }

  private startTimer(): void {
    if (this.callInterval) {
      clearInterval(this.callInterval);
    }

    this.callInterval = setInterval(
      () => this.intervalElapsed.emit(),
      this.currentCallDelay * 1000,
    );

    // Restart animation
    this.circleVisible = false;
    setTimeout(() => (this.circleVisible = true));
  }

  private settingsDelayOrDefault(value?: number): number {
    if (value && value > 0) {
      return Math.max(value, this.minInterval);
    }

    return this.defaultInterval;
  }

  private nextHigherOrFirst(current: number): number {
    const sorted = [...this.delayOptions].sort((a, b) => a - b);

    return sorted.find((v) => v > current) ?? sorted[0];
  }

  private get minInterval(): number {
    return Math.min(...this.delayOptions);
  }

  ngOnDestroy(): void {
    this.settingsSubscription.unsubscribe();
    if (this.callInterval !== null) {
      clearInterval(this.callInterval);
      this.callInterval = null;
    }
  }
}
