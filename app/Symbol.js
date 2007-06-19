SYM = {
	OBJECT:			"OBJECT",
	FUNCTION:		"FUNCTION",
	CONSTRUCTOR:	"CONSTRUCTOR",
	METHOD:			"METHOD",
	PROPERTY:		"PROPERTY",
	VIRTUAL:		"VIRTUAL",
};

/** @constructor */
function Symbol(name, params, type, doc, other) {
	if (name.indexOf("/") > -1) {
		var n = name.split("/");
		var last = n.pop();
		name = "{"+n.join("}.{")+"}."+last
	}

	this.name = name;
	this.params = params;
	this.memberof = "";
	this.properties = [];
	this.methods = [];
	this.type = type;
	this.doc = doc || "/** @undocumented */";
}

Symbol.prototype.toString = function() {
	return "[object Symbol]";
}

Symbol.prototype.is = function(what) {
    return this.type === SYM[what];
}

Symbol.prototype.getName = function() {
	var names = this.doc.getTag("name");
	if (names.length) return names[0].desc;
	else if (this.name) return this.name;
}

Symbol.prototype.getDesc = function() {
	var descs = this.doc.getTag("desc");
	if (descs.length) {
		return descs[0].desc
	}
	else {
		var overviews = this.doc.getTag("overview");
		if (overviews.length) return overviews[0].desc
	}
}

Symbol.prototype.get = function(tagName) {
	var results = this.doc.getTag(tagName); // try and get user defined param tags
	
	if (tagName == "param") {
		if (this.params.length && !results.length) { // no user defined params so use parser defined params
			results = [];
			for (var i = 0; i < this.params.length; i++) {
				results.push(new DocTag("param "+this.params[i]));
			}
		}
	}
	return results;
}