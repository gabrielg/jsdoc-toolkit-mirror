
require("DocTag.js");

SYM = {
	OBJECT:			"OBJECT",
	FUNCTION:		"FUNCTION",
	CONSTRUCTOR:	"CONSTRUCTOR",
	METHOD:			"METHOD",
	VIRTUAL:		"VIRTUAL",
};

/** @constructor */
function Symbol(name, params, body, type, parent, doc) {
	this.name = name;
	this.params = params;
	this.body = body;
	this.type = type;
	this.parent = parent;
	this.doc = doc || "/** @undocumented */";
}

Symbol.prototype.toString = function() {
	return "[object Symbol]";
}

Symbol.prototype.is = function(what) {
    return this.type === SYM[what];
}

Symbol.prototype.getDescription = function() {
	var descriptions = this.doc.getTag("description");
	if (descriptions.length) {
		return descriptions[0].desc
	}
	else {
		var overviews = this.doc.getTag("overview");
		if (overviews.length) return overviews[0].desc
	}
}

Symbol.prototype.getName = function() {
	var names = this.doc.getTag("name");
	if (names.length) return names[0].desc;
	else if (this.name) return this.name;
}

Symbol.prototype.get = function(tagName, tagPart) {
	var results = this.doc.getTag(tagName);
	
	if (tagName == "param") {
		if (this.params.length && !results.length) {
			results = [];
			for (var i = 0; i < this.params.length; i++) {
				results.push(new DocTag("param "+this.params[i]));
			}
		}
	}
	return results;
}

function Scope(containers) {
	this.containers = containers.split(".");
}

Scope.prototype.push = function(newContainer, isInstance) {
	if (isInstance) newContainer = "{"+newContainer+"}";
	this.containers.push(newContainer);
}

Scope.prototype.peek = function() {
	return this.containers[this.containers-1];
}

Scope.prototype.pop = function(newContainer) {
	return this.containers.pop();
}

Scope.prototype.toString = function() {
	return this.containers.join(".");
}