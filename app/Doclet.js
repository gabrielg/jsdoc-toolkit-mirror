/** @constructor */
function Doclet(comment) {
	this.comment = comment;
	
	var src = comment.replace(/(^\/\*\*|\*\/$)/g, "").replace(/^\s*\* ?/gm, "");
	if (src.match(/^\s*[^@\s]/)) src = "@desc "+src;
	
	var tagTexts = src.split(/(^|[\r\f\n])\s*@/);
	
	this.tags = [];
	for (var i = 0; i < tagTexts.length; i++) {
		if (!tagTexts[i].match(/^\w/)) continue; // may have empty elements on some platforms
		this.tags.push(new DocTag(tagTexts[i]));
	}
}

Doclet.prototype.toString = function() {
	return "[object Doclet]";
}

SYSTAG = {
	"name": true,
	"desc": true,
	"param": true,
	"return": true,
	"property": true,
	"overview": true,
	"memberof": true,
	"type": true,
	"constructor": true,
	"alias": true,
	"function": true,
	"method": true,
	"undocumented": true,
	"private": true,
	"library": true
};

Doclet.prototype.getTag = function(tagTitle) {
	var result = [];
	
	if (tagTitle) {
		for (var i = 0; i < this.tags.length; i++) {
			if (this.tags[i].title == tagTitle) {
				result.push(this.tags[i]);
			}
		}
	}
	else {
		for (var i = 0; i < this.tags.length; i++) {
			if (!SYSTAG[this.tags[i].title]) {
				result.push(this.tags[i]);
			}
		}
	}
	
	return result;
}
