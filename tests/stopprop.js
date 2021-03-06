"use hopscript"

var hh = require("hiphop")

var prg =
    <hh.module O>
      <hh.loop>
	<hh.emit O/>
	<hh.pause/>
      </hh.loop>
    </hh.module>;

var m = new hh.ReactiveMachine(prg, "foo");

m.addEventListener("O", function(evt) {
   console.log("first", evt);
});

m.addEventListener("O", function(evt) {
   evt.stopPropagation();
   console.log("second", evt);
});

m.addEventListener("O", function(evt) {
   console.log("third", evt);
});

exports.prg = m;
