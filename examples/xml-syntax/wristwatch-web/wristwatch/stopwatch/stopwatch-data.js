"use hopscript";

var TD = require("../data/time-data.js");
var BD = require("../data/beep-data.js");

//===============
// Stopwatch Time
//===============

// Build a Stopwatch Time

function StopwatchTime (mn, s, hs) {
   this.minutes = mn;
   this.seconds = s;
   this.hundredths = hs;
}
exports.StopwatchTime = StopwatchTime;

// The initial stopwatch time

var InitialStopwatchTime = new StopwatchTime(0,0,0);
exports.InitialStopwatchTime = InitialStopwatchTime;

// Turn an StopwatchTime into a string

StopwatchTime.prototype.toString = function() {
   return this.minutes + ":" + this.seconds + ":" + this.hundredths;
}

// Print an StopwatchTime event

function PrintStopwatchTimeEvent (evt) {
   var st = evt.value;
   console.log(st.minutes + ":" + st.seconds + ":" + st.hundredths);
}
exports.PrintStopwatchTimeEvent = PrintStopwatchTimeEvent;

// Increment a stopwacth time by one hundredth (functional)

function IncrementStopwatchTime (st) {
   var res = st;
   res.hundredths++;
   if (res.hundredths == TD.HundredthsPerSecond) {
      res.hundredths = 0;
      res.seconds++;
      if (res.seconds == TD.SecondsPerMinute) {
	 res.seconds = 0;
	 res.minutes++;
	 if (res.minutes == TD.MinutesPerHour) {
	    res.minutes = 0;
	 }
      }
   }
   return res;
}
exports.IncrementStopwatchTime = IncrementStopwatchTime;

// Beep detection

function StopwatchBeep (st) {
   if ((st.hundredths==0)
       && (st.seconds==0)
       && ((st.minutes % BD.Stopwatch_MinutesToBeep) == 0)) {
      return BD.Stopwatch_NumberOfBeepsPerSecond;
   } else {
      return BD.NoBeep;
   }
}
exports.StopwatchBeep = StopwatchBeep;

