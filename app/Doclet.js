/** @constructor */
function Doclet(comment) {
	this.comment = comment;
	
	var src = comment.replace(/(^\/\*\*|\*\/$)/g, "").replace(/^\s*\* ?/gm, "");
	if (src.match(/^\s*[^@\s]/)) src = "@description "+src;
	
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

Doclet.prototype.getTag = function(tagTitle) {
	var result = [];
	for (var i = 0; i < this.tags.length; i++) {
		if (this.tags[i].title == tagTitle) {
			result.push(this.tags[i]);
		}
	}
	return result;
}
