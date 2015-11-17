"use hopscript"

var rk = require("./reactive-kernel.js");

function ASTNode(name, loc) {
   this.name = name
   this.loc = loc;
   this.machine = null;
   this.parent = null;
}
ASTNode.prototype.accept = function(visitor) {
   visitor.visit(this);
}
ASTNode.prototype.accept_auto = ASTNode.prototype.accept;
exports.ASTNode = ASTNode;

/* Statements nodes */

function Statement(name, loc) {
   /* `machine` is ast.ReactiveMachine when building the AST and work on it,
      but it must be changed by a rk.ReactiveMachine when factory() is called */

   ASTNode.call(this, name, loc);
   this.incarnation_lvl = 0;
}
Statement.prototype = new ASTNode();
Statement.prototype.factory = function() { /* Return runtine (rk.*)
					      program node of this */ }
exports.Statement = Statement;

function Emit(loc, signal_name, expr=undefined) {
   Statement.call(this, "EMIT", loc);
   this.signal_name = signal_name;
   this.expr = expr;
}
Emit.prototype = new Statement();
Emit.prototype.factory = function() {
   return new rk.Emit(this.machine,
		      this.loc,
		      this.signal_name,
		      this.expr);
}
exports.Emit = Emit;

function Nothing(loc) {
   Statement.call(this, "NOTHING", loc);
}
Nothing.prototype = new Statement();
Nothing.prototype.factory = function() {
   return new rk.Nothing(this.machine, this.loc);
}
exports.Nothing = Nothing;

function Pause(loc) {
   Statement.call(this, "PAUSE", loc);
   this.k0_on_depth = false;
}
Pause.prototype = new Statement();
Pause.prototype.factory = function() {
   var p = new rk.Pause(this.machine, this.loc);
   p.k0_on_depth = this.k0_on_depth;
   return p;
}
exports.Pause = Pause;

function Exit(loc, trap_name) {
   Statement.call(this, "EXIT", loc);
   this.trap_name = trap_name;
   this.return_code = 2;
}
Exit.prototype = new Statement();
Exit.prototype.factory = function() {
   return new rk.Exit(this.machine, this.loc, this.trap_name, this.return_code);
}
exports.Exit = Exit;

function Halt(loc) {
   Statement.call(this, "HALT", loc);
}
Halt.prototype = new Statement();
Halt.prototype.factory = function() {
   return new rk.Halt(this.machine, this.loc);
}
exports.Halt = Halt;

function Atom(loc, func) {
   Statement.call(this, "ATOM", loc);
   this.func = func;
}
Atom.prototype = new Statement();
Atom.prototype.factory = function() {
   return new rk.Atom(this.machine, this.loc, this.func);
}
exports.Atom = Atom;

function Await(loc, signal_name, test_pre) {
   Circuit.call(this, "AWAIT", loc);
   this.signal_name = signal_name;
   this.test_pre = test_pre;
}
Await.prototype = new Statement();
Await.prototype.factory = function() {
   return new rk.Await(this.machine, this.loc, this.signal_name, this.test_pre);
}
exports.Await = Await;

/* Circuit nodes */

function Circuit(name, loc, subcircuit) {
   /* `subcircuit` is an AST node when building the AST and work on it,
      but it become an rk.Circuit before the call of factory() */
   Statement.call(this, name, loc);
   this.subcircuit = [].concat(subcircuit);
}
Circuit.prototype = new Statement();
Circuit.prototype.accept_auto = function(visitor) {
   visitor.visit(this);
   for (var i in this.subcircuit)
      this.subcircuit[i].accept_auto(visitor);
}
exports.Circuit = Circuit;

function Trap(loc, trap_name, subcircuit) {
   Circuit.call(this, "TRAP", loc, subcircuit);
   this.trap_name = trap_name;
}
Trap.prototype = new Circuit();
Trap.prototype.factory = function() {
   return new rk.Trap(this.machine,
		      this.loc,
		      this.subcircuit[0],
		      this.trap_name)
}
exports.Trap = Trap;

function ReactiveMachine(loc,
			 machine_name,
			 debug,
			 input_signals,
			 output_signals,
			 subcircuit) {
   Circuit.call(this, "REACTIVEMACHINE", loc, subcircuit);
   this.machine_name = machine_name;
   this.debug = debug;
   this.input_signals = input_signals;
   this.output_signals = output_signals;

   /* usefull only for program composition (see RunVisitor) */
   this.local_signals = [];
   this.trap_names = [];
}
ReactiveMachine.prototype = new Circuit();
exports.ReactiveMachine = ReactiveMachine;

function Abort(loc, signal_name, test_pre, subcircuit) {
   Circuit.call(this, "ABORT", loc, subcircuit);
   this.signal_name = signal_name;
   this.test_pre = test_pre;
}
Abort.prototype = new Circuit();
Abort.prototype.factory = function() {
   return new rk.Abort(this.machine,
		       this.loc,
		       this.subcircuit[0],
		       this.signal_name,
		       this.test_pre);
}
exports.Abort = Abort;

function Loop(loc, subcircuit) {
   Circuit.call(this, "LOOP", loc, subcircuit);
}
Loop.prototype = new Circuit();
Loop.prototype.factory = function() {
   return new rk.Loop(this.machine, this.loc, this.subcircuit[0]);
}
exports.Loop = Loop;

function Suspend(loc, signal_name, test_pre, subcircuit) {
   Circuit.call(this, "SUSPEND", loc, subcircuit);
   this.signal_name = signal_name;
   this.test_pre = test_pre;
}
Suspend.prototype = new Circuit();
Suspend.prototype.factory = function() {
   return new rk.Suspend(this.machine,
			 this.loc,
			 this.subcircuit[0],
			 this.signal_name,
			 this.test_pre)
}
exports.Suspend = Suspend;

function Parallel(loc, subcircuits) {
   Circuit.call(this, "PARALLEL", loc, subcircuits);
}
Parallel.prototype = new Circuit();
Parallel.prototype.factory = function() {
   return new rk.Parallel(this.machine,
			  this.loc,
			  this.subcircuit[0],
			  this.subcircuit[1]);
}
exports.Parallel = Parallel;

function Present(loc, signal_name, test_pre, subcircuits) {
   if (subcircuits[1] == undefined)
      subcircuits[1] = new Nothing(loc);

   Circuit.call(this, "PRESENT", loc, subcircuits);
   this.signal_name = signal_name;
   this.test_pre = test_pre;
}
Present.prototype = new Circuit();
Present.prototype.factory = function() {
   return new rk.Present(this.machine,
			 this.loc,
			 this.signal_name,
			 this.test_pre,
			 this.subcircuit[0],
			 this.subcircuit[1]);
}
exports.Present = Present;

function Sequence(loc, subcircuits) {
   Circuit.call(this, "SEQUENCE", loc, subcircuits);
}
Sequence.prototype = new Circuit();
Sequence.prototype.factory = function() {
   return new rk.Sequence(this.machine, this.loc, this.subcircuit);
}
exports.Sequence = Sequence;


/* sigs_assoc must be checked before the call of this constructor,
   see xml-compiler */

function Run(loc, ast, sigs_assoc) {
   Circuit.call(this, "RUN", loc, ast);
   this.sigs_assoc = sigs_assoc;
}
Run.prototype = new Circuit();
Run.prototype.factory = function() {
   /* Run statement is invisible to runtime, it directly branch into
      a clone of the subcircuit of the callee machine */
   return this.subcircuit[0];
}
exports.Run = Run;

/* Signal nodes */

function LocalSignal(loc,
		     signal_name,
		     subcircuit,
		     type,
		     init_value,
		     combine_with) {
   if ((init_value != undefined || combine_with != undefined)
       && type == undefined)
      rk.fatal_error("Signal " + signal_name + " must be typed.");

   if (type != undefined && combine_with != undefined)
      rk.check_valued_signal_definition(type, combine_with, signal_name);

   Circuit.call(this, "LOCALSIGNAL", loc, subcircuit);
   this.signal_name = signal_name;
   this.type = type;
   this.init_value = init_value;
   this.combine_with = combine_with;
}
LocalSignal.prototype = new Circuit();
LocalSignal.prototype.factory = function() {
   return new rk.LocalSignalIdentifier(this.machine,
				       this.loc,
				       this.subcircuit[0],
				       this.signal_name);
}
exports.LocalSignal = LocalSignal;

function Signal(debug_name, loc, signal_ref) {
   ASTNode.call(this, debug_name, loc);
   this.signal_ref = signal_ref;
}
Signal.prototype = new ASTNode();
exports.Signal = Signal;

function InputSignal(loc, signal_ref) {
   Signal.call(this, "INPUTSIGNAL", loc, signal_ref);
}
InputSignal.prototype = new Signal();
exports.InputSignal = InputSignal;

function OutputSignal(loc, signal_ref) {
   Signal.call(this, "OUTPUTSIGNAL", loc, signal_ref);
}
OutputSignal.prototype = new Signal();
exports.OutputSignal = OutputSignal;