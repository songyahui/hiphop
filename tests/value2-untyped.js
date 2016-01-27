"use hopscript"

var hh = require("hiphop");

function minus(arg1, arg2) { return arg1 - arg2 };
function plus(arg1, arg2) { return arg1 + arg2 };

var prg = <hh.module>
  <hh.outputsignal name="I" valued />
  <hh.outputsignal name="O" init_value=5 valued />
  <hh.outputsignal name="U" valued />
  <hh.loop>
    <hh.sequence>
      <hh.emit signal_name="I" func=${plus} exprs=${[(3 - 2), 5]}/>
      <hh.emit signal_name="O" func=${plus} exprs=${[hh.value("I"), 7]}/>
      <hh.emit signal_name="U" func=${minus} exprs=${[hh.preValue("O"), 1]}/>
      <hh.pause/>
    </hh.sequence>
  </hh.loop>
</hh.module>;

exports.prg = new hh.ReactiveMachine(prg, "value2");
