/** @constructor */
DocTag = function(src) {
	// like @title {type} name/desc
	var parts = src.match(/^(\S+)(?:\s+\{\s*([\S\s]+?)\s*\})?\s*([\S\s]*\S)?/);
	
	this.title = parts[1].toLowerCase();
	this.type = parts[2];
	if (this.type) {
		this.type = this.type.replace(/\s*(,|\|)\s*/g, "|");
	}
	this.name = undefined;
	this.desc = parts[3];
	
	if (this.desc) {
		if (this.title == "param") {
			var m = this.desc.match(/^\s*(\[?)([a-zA-Z0-9.$_]+)(\]?)(?:\s+([\S\s]*\S))?/);
			if (m) {
				if (m[1] && m[3]) this.isOptional = true; // bracketed name means optional
				this.name = m[2];
				this.desc = m[4];
			}
		}
		else if (this.title == "property") {
			m = this.desc.match(/^\s*([a-zA-Z0-9.$_]+)(?:\s+([\S\s]*\S))?/);
			if (m) {
				this.name = m[1];
				this.desc = m[2];
			}
		}
	}
}

DocTag.prototype.toString = function() {
	return this.desc;
}