/** @constructor */
function Layout(p) {
	this.init = function(p) {
	}
	/**
	 The id.
	 @type number
	*/
	this.id = p.id;
	
	/** @type string */
	this.orientation = "landscape";
}

/**
@constructor
@inherits Layout
*/
function Page() {
	this.reset = function(b) {
	}
}

/**
@extends Page
@constructor
*/
function ThreeColumnPage() {
	this.init = function(p) {
	}
}
