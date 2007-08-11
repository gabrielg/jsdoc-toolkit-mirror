require("app/JsToke.js");

/**
 * @class Turn source code into HTML with tokens marked for hilighting with CSS.
 */
function JsHilite(sourceCode) {
	this.tokenizer = new TokenReader(sourceCode);
	this.tokenizer.keepComments = true;
	this.tokenizer.keepDocs = true;
	this.tokenizer.keepWhite = true;
	Token.prototype.toString = function() { 
		return "<span class=\""+this.type+"\">"+this.data.replace(/</g, "&lt;")+"</span>";
	}
	this.header = "<html><head><style>\n\
	.KEYW {color: #933;}\n\
	.COMM {color: #bbb; font-style: italic;}\n\
	.NUMB {color: #393;}\n\
	.STRN {color: #393;}\n\
	.REGX {color: #339;}\n\
	.linenumber {border-right: 1px dotted #666; color: #666; font-style: normal;}\n\
	</style></head><body><pre>";
	this.footer = "</pre></body></html>";
	this.showLinenumbers = true;
}

JsHilite.prototype.hilite = function() {
	var hilited = this.tokenizer.tokenize().join("");
	var linenumber = 1;
	if (this.showLinenumbers) hilited = hilited.replace(/(^|\n)/g, function(m){return m+"<span class='linenumber'>"+((linenumber<10)? " ":"")+((linenumber<100)? " ":"")+(linenumber++)+"</span> "});
	
	return this.header+hilited+this.footer;
}