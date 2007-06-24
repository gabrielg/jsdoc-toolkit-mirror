SYM = {
	OBJECT:			"OBJECT",
	FUNCTION:		"FUNCTION",
	CONSTRUCTOR:	"CONSTRUCTOR",
	VIRTUAL:		"VIRTUAL",
};

/** @constructor */
function Symbol(name, params, isa, comment) {
	this.name = name;
	this.alias = name;
	this.desc = "";
	this.params = params;
	this.memberof = "";
	this.properties = [];
	this.methods = [];
	this.isa = isa;
	
	this.doc = new Doclet((comment || "/** @desc undocumented */"));
	
	// move certain data out of the tags and into the Symbol
	if (this.doc.getTag("overview").length) {
		var libraries;
		if ((libraries = this.doc.getTag("library")) && libraries.length) {
			this.name = libraries[0].desc;
			this.doc.dropTag("library");
		}
		
		var overviews = this.doc.getTag("overview");
		this.desc = overviews[0].desc;
		this.doc.dropTag("overview");
	}
	else {
		var descs = this.doc.getTag("desc");
		if (descs.length) {
			this.desc = descs[0].desc;
			this.doc.dropTag("desc");
		}
		
		var params = this.doc.getTag("param");
		if (params.length) { // user defined params override those defined by parser
			this.params = params;
			this.doc.dropTag("param");
		}
		else { // promote parser params into DocTag objects
			for (var i = 0; i < this.params.length; i++) {
				this.params[i] = new DocTag("param "+this.params[i]);
			}
		}
		
		var constructors = this.doc.getTag("constructor");
		if (constructors.length) {
			this.isa = SYM.CONSTRUCTOR;
			this.doc.dropTag("constructor");
		}
	}
}

Symbol.prototype.toString = function() {
	return "[object Symbol]";
}

Symbol.prototype.is = function(what) {
    return this.isa === SYM[what];
}