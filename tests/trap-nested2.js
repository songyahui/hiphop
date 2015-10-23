var rjs = require("../xml-compiler.js");
var reactive = require("../reactive-kernel.js");
require("../js2esterel.js");

var sigA = new reactive.Signal("A", false);
var sigB = new reactive.Signal("B", false);
var sigC = new reactive.Signal("C", false);
var sigD = new reactive.Signal("D", false);

var prg = <rjs.reactivemachine name="trapnested2">
  <rjs.outputsignal ref=${sigA}/>
  <rjs.outputsignal ref=${sigB}/>
  <rjs.outputsignal ref=${sigC}/>
  <rjs.outputsignal ref=${sigD}/>
  <rjs.sequence>
    <rjs.emit signal_name="A"/>
    <rjs.trap trap_name="U">
      <rjs.sequence>
	<rjs.trap trap_name="T">
	  <rjs.sequence>
	    <rjs.exit trap_name="U"/>
	    <rjs.emit signal_name="B"/>
	  </rjs.sequence>
	</rjs.trap>
	<rjs.emit signal_name="C"/>
      </rjs.sequence>
    </rjs.trap>
    <rjs.emit signal_name="D"/>
  </rjs.sequence>
</rjs.reactivemachine>;

exports.prg = prg;