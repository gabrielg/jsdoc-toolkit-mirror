/**
 * @fileOverview Represents a collection of doclets associated with a file.
 * @name DocFile
 * @author Michael Mathews <a href="mailto:micmath@gmail.com">micmath@gmail.com</a>
 * @revision $Id$
 * @license <a href="http://en.wikipedia.org/wiki/MIT_License">X11/MIT License</a>
 *          (See the accompanying README file for full details.)
 */
 
/**
 * @constructor
 * @param {string} [path] The file path to the source file.
 */
function DocFile(path) {
	this.path = path;
	this.overview = new Symbol(path, [], "FILE", "/** @overview No overview provided. */");
	this.symbols = [];
}

DocFile.prototype.addSymbol = function(symbol) {
	this.symbols.push(symbol);
}

DocFile.prototype.addOverview = function(overview) {
	this.overview = overview;
	if (!overview.name) {
		this.overview.name = Util.fileName(this.path);
	}
}

DocFile.prototype.getSymbol = function(alias) {
	for (var i = 0; i < this.symbols.length; i++) {
		if (this.symbols[i].alias == alias) return this.symbols[i];
	}
    return null;
}
/**
 * Add a group of doclets. Finds relationships between doclets within the group
 */
DocFile.prototype.load = function(symbols, opt) {
	for (var s = 0; s < symbols.length; s++) {
		if (symbols[s].doc.getTag("ignore").length)
			continue;
			
		if (symbols[s].doc.getTag("private").length && !opt.p)
			continue;
		
		var parents;
		if ((parents = symbols[s].doc.getTag("memberof")) && parents.length) {
			symbols[s].name = parents[0]+"/"+symbols[s].name;
			symbols[s].doc._dropTag("memberof");
		}
		
		if (symbols[s].desc == "undocumented") {
			if (/(^_|[.\/]_)/.test(symbols[s].name) && !opt.A) {
				continue;
			}
			if (!opt.a && !opt.A) {
				continue;
			}
		}
		
		// is this a member of another object?
		var parts = null;
		if (
			symbols[s].name.indexOf("/") > -1
			&& (parts = symbols[s].name.match(/^(.+)\/([^\/]+)$/))
		) {
			var parentName = parts[1].replace(/\//g, ".");
			var childName = parts[2];
			
			symbols[s].alias = symbols[s].name.replace(/\//g, ".");
			symbols[s].name = childName;
			symbols[s].memberof = parentName;

			// is the parent defined?
			var parent = this.getSymbol(parentName);

			if (!parent) LOG.warn("Member '"+childName+"' documented but no documentation exists for parent object '"+parentName+"'.");
			else {
				if (symbols[s].is("OBJECT")) {
					parent.properties.push(symbols[s]);
				}
				if (symbols[s].is("FUNCTION")) {
					parent.methods.push(symbols[s]);
				}
			}
		}
		
		// does this inherit methods or properties?
		for (var i = 0; i < symbols[s].inherits.length; i++) {
			var base = this.getSymbol(symbols[s].inherits[i]);
			if (!base) {
				LOG.warn("Can't determine inherited methods or properties from unfound '"+symbols[s].inherits[i]+"' symbol.");
			}
			else {
				symbols[s].inheritedMethods =
					symbols[s].inheritedMethods.concat(base.methods);
				symbols[s].inheritedProperties =
					symbols[s].inheritedProperties.concat(base.properties);
			}
		}
		
		this.addSymbol(symbols[s]);
	}
}