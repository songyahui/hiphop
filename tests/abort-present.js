"use hopscript"

var rjs = require("../xml-compiler.js");
var rkernel = require("../reactive-kernel.js");

var sigI = new rkernel.Signal("I", false, null);
var sigJ = new rkernel.Signal("J", false, function() {
   console.log("EMIT J");
});

var sigK = new rkernel.Signal("K", false, function() {
   console.log("EMIT K");
});

var sigV = new rkernel.Signal("V", false, function() {
   console.log("EMIT V");
});

var prg = <rjs.reactivemachine>
  <rjs.loop>
    <rjs.sequence>
      <rjs.abort signal=${sigI}>
	<rjs.sequence>
	  <rjs.emit signal=${sigJ}/>
	  <rjs.pause/>
	  <rjs.emit signal=${sigV}/>
	  <rjs.pause/>
	</rjs.sequence>
      </rjs.abort>
      <rjs.present signal=${sigI}>
	<rjs.emit signal=${sigK}/>
      </rjs.present>
    </rjs.sequence>
  </rjs.loop>
</rjs.reactivemachine>

sigI.set = true;
prg.react();
prg.react();
sigI.set = true;
prg.react();
prg.react();