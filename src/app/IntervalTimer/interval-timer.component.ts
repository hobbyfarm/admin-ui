import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'interval-timer',
  templateUrl: './interval-timer.component.html',
  styleUrls: ['./interval-timer.component.scss']
})
export class IntervalTimer implements OnInit, OnDestroy {

  // Output to emit an Event everytime the Timer reaches 0
  @Output()
  intervalElapsed: EventEmitter<void> = new EventEmitter()

  // Optional parameter to define the interval times that are needed in the parent Component. This overwrites the default of 10, 30, 60, 120 and 300 seconds if provided
  @Input()
  delayOptionsArray: number[] = [10, 30, 60, 120, 300];

  // Optional parameter to provide another label for the Timer Component than "Refresh Rate"
  @Input()
  label: string = "Refresh Rate";

  public callInterval: any;
  public currentCallDelay: number;
  public circleVisible: boolean = true;
  public delayOptions: Generator; 


  ngOnInit(): void {    
    function* cycle<T>(array: T[]){
      while (true) yield* array;
    } 
    this.delayOptions = cycle(this.delayOptionsArray) 
    this.changeDelay();
  }

  onTimerClick() {
    this.changeDelay();
    this.intervalElapsed.emit()
  }


  changeDelay() {
    //Set next value of the interval array as call delay
    this.currentCallDelay = this.delayOptions.next().value;
  
    clearInterval(this.callInterval);

    this.callInterval = setInterval(() => {
      this.intervalElapsed.emit();
     } , this.currentCallDelay * 1000);

     //Reload the Circle to refresh the Animation
    this.circleVisible = false;
    setTimeout(() => {      
      this.circleVisible = true;
    },0);
  }

  ngOnDestroy(): void {    
      clearInterval(this.callInterval)
  }

}
