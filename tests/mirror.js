"use hopscript"

var rjs = require("../lib/reactive-js.js");

function foo(name) {
   console.log("hi from foo signal", name, "is set!")
}

function bar(name, value) {
   console.log("hi from bar signal", name, "is set with value", value, "!")
}

var prg = <rjs.reactivemachine debug name="mirror">
  <rjs.inputsignal name="I1" />
  <rjs.outputsignal name="O1" react_functions=${foo}/>
  <rjs.inputsignal name="I2" type="number"/>
  <rjs.outputsignal name="O2" type="number" react_functions=${bar}/>
  <rjs.inputsignal name="I3" type="string"/>
  <rjs.outputsignal name="O3" type="string" react_functions=${bar}/>
  <rjs.inputsignal name="I4" type="number" combine_with="+"/>
  <rjs.outputsignal name="O4" type="number" react_functions=${bar}/>
  <rjs.loop>
    <rjs.sequence>
      <rjs.present signal_name="I1">
	<rjs.emit signal_name="O1"/>
      </rjs.present>
      <rjs.present signal_name="I2">
	<rjs.emit signal_name="O2"
		  expr=${<rjs.sigexpr get_value signal_name="I2"/>}/>
      </rjs.present>
      <rjs.present signal_name="I3">
	<rjs.emit signal_name="O3"
		  expr=${<rjs.sigexpr get_value signal_name="I3"/>}/>
      </rjs.present>
      <rjs.present signal_name="I4">
	<rjs.emit signal_name="O4"
		  expr=${<rjs.sigexpr get_value signal_name="I4"/>}/>
      </rjs.present>
      <rjs.pause/>
    </rjs.sequence>
  </rjs.loop>
</rjs.reactivemachine>
exports.prg = prg;
