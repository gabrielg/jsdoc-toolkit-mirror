/** @constructor */
function foo() {
	/** process the foo */
	this.processFoo = function(f) {
	}
}

/**
@constructor
@inherits foo
*/
function bar() {
	/** do the bar */
	this.doBar = function(b){
	}
}

/**
@extends bar
@constructor
*/
function faz() {
}

/**
	@inherits foo
	@inherits bar
	@constructor
*/
function zop() {
}