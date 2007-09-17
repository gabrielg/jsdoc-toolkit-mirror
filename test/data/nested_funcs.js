/**
 @class
*/
Foo = function(id) {
	// this is a bit twisted, but if you call Foo() you will then
	// modify Foo(). This is kinda, sorta non-insane, because you
	// would have to call Foo() 100% of the time to use Foo's methods
	Foo.prototype.methodOne = function(bar) {
	  alert(bar);
	};
	
	// same again
	Foo.prototype.methodTwo = function(bar2) {
	  alert(bar2);
	};
	
	// but this is just inaccessible from outside the enclosing function
	Bar = function(pez) {
	  alert(pez);
	};
	
	// and this only executed if the enclosing function is actually called
	// and who knows if that will ever happen?
	Zop.prototype.zap = function(p){
		alert(p);
	}
};
