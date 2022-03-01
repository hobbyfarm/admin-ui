import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'timed-call',
  templateUrl: './timed-call.component.html',
  styleUrls: ['./timed-call.component.scss']
})
export class TimedCallComponent implements OnInit, OnDestroy {

  // Function that will be called everytime the Timer reaches 0.
  @Input()
  functionToCall: Function;

  // Optional parameter to define the interval times that are needed in the parent Component. This overwrites the default of 10, 30, 60, 120 and 300 seconds if provided
  @Input()
  delayOptions?: number[];

  // Optional parameter to provide another label for the Timer Component than "Refresh Rate"
  @Input()
  label?: string;

  public callInterval: any;
  public currentCallDelay: number;
  public defaultDelayOptions: number[] = [10, 30, 60, 120, 300];
  public circleVisible: boolean = true; 

  constructor() { }  


  ngOnInit(): void {
    // Establish timeout interval, get the named reference for it to update it later
    this.label = this.label ? this.label : "Refresh Rate"
    this.delayOptions = (this.delayOptions ? this.delayOptions : this.defaultDelayOptions)
    this.currentCallDelay = this.delayOptions[0];
    this.callInterval = setInterval(() => {
      this.functionToCall();
     } , this.currentCallDelay * 1000);
  }



  changeDelay() {
    //Set next value of the interval array as call delay
    var index = this.delayOptions.indexOf(this.currentCallDelay);  
    if (index < this.delayOptions.length - 1) {
      this. currentCallDelay = this.delayOptions[index + 1];
    } else {
      this.currentCallDelay = this.delayOptions[0];
    }        
  
    clearInterval(this.callInterval);
    this.callInterval = setInterval(() => {
      this.functionToCall();
     } , this.currentCallDelay * 1000);

    //Reload the Circle to refresh the Animation
    this.circleVisible = false;
    setTimeout(() => {      
      this.circleVisible = true;           
    },0);

    setTimeout(() => {
      var circle = document.getElementById('countdownCircle');
      circle.style.animationDuration = this.currentCallDelay+'s';
    },0);
    
    this.functionToCall(); //also refresh when call delay has changed
  }

  ngOnDestroy(): void {    
      clearInterval(this.callInterval)    
  }

}
