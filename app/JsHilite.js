require("app/JsToke.js");

function JsHilite(sourceCode) {
	this.tokenizer = new TokenReader(sourceCode);
	this.tokenizer.keepComments = true;
	this.tokenizer.keepDocs = true;
	this.tokenizer.keepWhite = true;
	Token.prototype.toString = function() { 
		return "<span class=\""+this.type+"\">"+this.data.replace(/</g, "&lt;")+"</span>";
	}
	this.header = "<html><head><style>\n\
	.KEYW { color: #933; }\n\
	.COMM { color: #bbb; }\n\
	.NUMB { color: #393; }\n\
	.STRN { color: #393; }\n\
	.REGX { color: #339; }\n\
	</style></head><body><pre>";
	this.footer = "</pre></body></html>";
}

JsHilite.prototype.hilite = function() {
	return this.header+this.tokenizer.tokenize().join("")+this.footer;
}