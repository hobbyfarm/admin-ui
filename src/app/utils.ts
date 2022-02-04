export function timeSince(date: Date,  end: Date = new Date(), series: number = 2,) {
    var seconds: number = Math.floor((end.getTime() - date.getTime()) / 1000);
    var intervals = [31536000, 2592000, 86400, 3600, 60, 1];
    var intervalCounts = [0,0,0,0,0,0];
    var intervalStrings = ["year", "month", "day", "hour", "minute", "second"];
    var text = "";

    for(let i = 0; i < intervals.length; i++){
      let interval = seconds / intervals[i];
      if (interval > 1) {
        let count = Math.floor(interval)
        intervalCounts[i] = count;
        seconds -= count * intervals[i];
        continue;
      }
    }

    for(let i = 0; i < intervalCounts.length && series > 0; i++){
      if(intervalCounts[i] > 0){
        text += intervalCounts[i] + " " + intervalStrings[i] + (intervalCounts[i] > 1 ? "s" : "");
        series -= 1;
        if(series > 0){
          text += ", ";
        }
      }
    }

    return text;
}