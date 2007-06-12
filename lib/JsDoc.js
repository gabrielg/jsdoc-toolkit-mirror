/**
 * @fileOverview An automated documentation publishing system for JavaScript.
 * @author Michael Mathews <a href="mailto:micmath@gmail.com">micmath@gmail.com</a>
 * @version 0.6b
 * @revision $Id$
 * @license <a href="http://en.wikipedia.org/wiki/MIT_License">X11/MIT License</a>
 *          (See the accompanying README file for full details.)
 */

/**
 * Print a warning to stdout.
 * @param {string} msg
 */
function warn(msg, e) {
	if (e) msg = e.fileName+", line "+e.lineNumber+": "+msg;
	print(" > WARNING: "+msg);
}

/**
 * Print information to stdout.
 * @param {string} msg
 */
function inform(msg) {
	if (JsDoc.opt.v) print(" > "+msg);
}

JsDoc = {};

JsDoc.files = [];

JsDoc.File = function(name) {
	this.name = name;
	this.overview = "";
	this.symbols = [];
}

JsDoc.File.prototype.toString = function() {
	return "[object File]";
}

JsDoc.File.prototype.addSymbol = function(s) {
	if (s.type == SYM.VIRTUAL) {
		if (s.doc.getTag("function").length) s.type = SYM.FUNCTION;
		else if (s.doc.getTag("method").length) s.type = SYM.METHOD;
		else s.type = SYM.OBJECT;
		
		var parents = s.doc.getTag("memberof");
		if (parents.length) s.name = parents[0].desc+"/"+s.name;
	}
	
	if (s.doc.getTag("constructor").length || s.doc.getTag("class").length) s.type = SYM.CONSTRUCTOR
	
	this.symbols.push(s);
}

function Symbol(name, params, body, type, parent, doc) {
	this.name = name;
	this.params = params;
	this.body = body;
	this.type = type;
	this.parent = parent;
	this.doc = doc || "/** @undocumented */";
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

Symbol.prototype.get = function(tagName, tagPart) {
	var results = this.doc.getTag(tagName);
	
	if (tagName == "description") {
		if (results.length == 0) {
			results = this.doc.getTag("projectdescription");
		}
		if (results.length) return results[0];
		else return;
	}
	
	if (tagName == "param") {
		if (this.params.length && !results.length) {
			for (var i = 0; i < this.params.length; i++) {
				results.push(new JsDoc.Tag("param "+this.params[i]));
			}
		}
	}
	
	return results;
}

JsDoc.Doclet = function(comment) {
	this.comment = comment;
	
	var src = comment.replace(/(^\/\*\*|\*\/$)/g, "").replace(/^\s*\* ?/gm, "");
	if (src.match(/^\s*[^@\s]/)) src = "@description "+src;
	
	var tagTexts = src.split(/(^|[\r\f\n])\s*@/);
	
	this.tags = [];
	for (var i = 0; i < tagTexts.length; i++) {
		if (!tagTexts[i].match(/^\w/)) continue; // may have empty elements on some platforms
		this.tags.push(new JsDoc.Tag(tagTexts[i]));
	}
}

JsDoc.Doclet.prototype.toString = function() {
	return "[object Doclet]";
}

JsDoc.Doclet.prototype.getTag = function(tagTitle) {
	var result = [];
	for (var i = 0; i < this.tags.length; i++) {
		if (this.tags[i].title == tagTitle) {
			result.push(this.tags[i]);
		}
	}
	return result;
}

JsDoc.Tag = function(src) {
	// like @title {type} name/description
	var parts = src.match(/^(\S+)(?:\s+\{\s*([\S\s]+?)\s*\})?\s*([\S\s]*\S)?/);
	
	this.title = parts[1].toLowerCase();
	this.type = parts[2];
	if (this.type) {
		this.type = this.type.replace(/\s*(,|\|)\s*/g, "|");
	}
	this.name = "";
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

JsDoc.Tag.prototype.toString = function() {
	return this.desc;
}

function deploy_begin(context) {}
function deploy_each(source, context) {}
function deploy_finish(context) {}
function publish_begin(allFiles, context) {}
function publish_each(file, context) {}
function publish_finish(allFiles, context) {}

JsDoc.parse = function(srcFiles) {
	if (typeof srcFiles == "string") srcFiles = [srcFiles];
	
	deploy_begin(JsDoc.opt);
	
	for (var i = 0; i < srcFiles.length; i++) {
		var srcFile = srcFiles[i];
		
		inform("Tokenizing: "+srcFile);
		var src = ReadFile(srcFile);

		var tokens = new TokenReader(src).tokenize();
		var ts = new TokenStream(tokens);
		
		var file = new JsDoc.File(srcFile);
		
		inform("Parsing: "+srcFile);
		var parser = new JsParse();
		parser.parse(ts);
		
		for (var s = 0; s < parser.symbols.length; s++) {
			if (parser.symbols[s].doc.indexOf("@ignore") > -1)
				continue;
			if (parser.symbols[s].doc.indexOf("@undocumented") > -1 && !(JsDoc.opt.a||JsDoc.opt.A))
				continue;
			if (parser.symbols[s].name.indexOf("_") == 0 && !JsDoc.opt.A)
				continue;
			
			parser.symbols[s].doc = new JsDoc.Doclet(parser.symbols[s].doc);
			file.addSymbol(parser.symbols[s]);
		}
		if (parser.overview) file.overview = new Symbol(srcFile, [], "", "FILE", null, new JsDoc.Doclet(parser.overview));
		
		JsDoc.files.push(file);
	}
	
	deploy_finish(JsDoc.opt);	
}

JsDoc.publish = function(srcFiles) {
	if (JsDoc.opt.t === undefined) {
		warn("No template provided.");
		JsDoc.usage();
	}
	JsDoc.opt.t += "/";
	load(JsDoc.opt.t+"publish.js");
	
	publish_begin(JsDoc.files, JsDoc.opt);
	
	for (var i = 0; i < JsDoc.files.length; i++) {
		publish_each(JsDoc.files[i], JsDoc.opt);
	}
	
	publish_finish(JsDoc.files, JsDoc.opt);
}

/**
 * Various utility methods used by JsDoc.
 */
JsDoc.Util = {
	/**
	 * Turn a path into just the name of the file.
	 * @param {string} path
	 * @return {string} The fileName portion of the path.
	 */
	fileName: function(path) {
		var nameStart = Math.max(path.lastIndexOf("/")+1, path.lastIndexOf("\\")+1, 0);
		return path.substring(nameStart);
	},
	
	/**
	 * Turn a path into just the directory part.
	 * @param {string} path
	 * @return {string} The directory part of the path.
	 */
	dir: function(path) {
		var nameStart = Math.max(path.lastIndexOf("/")+1, path.lastIndexOf("\\")+1, 0);
		return path.substring(0, nameStart-1);
	},
	
	/**
	 * Get recursive list of files in a directory.
	 * @param {array} dirs Paths to directories to search.
	 * @param {int} recurse How many levels to descend, defaults to 1.
	 * @return {array} Paths to found files.
	 */
	ls: function(dir, recurse, allFiles, path) {
		if (path === undefined) { // initially
			var allFiles = [];
			var path = [dir];
		}
		if (path.length == 0) return allFiles;
		if (recurse === undefined) recurse = 1;
		
		dir = new File(dir);
		if (!dir.directory) return [String(dir)];
		var files = dir.list();
		
		for (var f = 0; f < files.length; f++) {
			var file = String(files[f]);
			if (file.match(/^\.[^\.\/\\]/)) continue; // skip dot files

			if ((new File(path.join("/")+"/"+file)).list()) { // it's a directory
				path.push(file);
				if (path.length-1 < recurse) JsDoc.Util.ls(path.join("/"), recurse, allFiles, path);
				path.pop();
			}
			else {
				allFiles.push((path.join("/")+"/"+file).replace("//", "/"));
			}
		}

		return allFiles;
	},
	
	/**
	 * Get commandline option values.
	 * @param {Array} args Commandline arguments. Like ["-a=xml", "-b", "--class=new", "--debug"]
	 * @param {object} optNames Map short names to long names. Like {a:"accept", b:"backtrace", c:"class", d:"debug"}.
	 * @return {object} Short names and values. Like {a:"xml", b:true, c:"new", d:true}
	 */
	getOptions: function(args, optNames) {
		var opt = {"_": []};
		for (var i = 0; i < args.length; i++) {
			var arg = new String(args[i]);
			var name;
			var value;
			if (arg.charAt(0) == "-") {
				if (arg.charAt(1) == "-") { // it's a longname like --foo
					arg = arg.substring(2);
					var m = arg.split("=");
					name = m.shift();
					value = m.shift();
					
					for (var n in optNames) { // convert it to a shortname
						if (name == optNames[n]) {
							name = n;
							if (typeof value == "undefined") value = true;
						}
					}
				}
				else { // it's a shortname like -f
					arg = arg.substring(1);
					var m = arg.split("=");
					name = m.shift();
					value = m.shift();;
					
					if (typeof value == "undefined") value = true;
				}
				
				opt[name] = value;
			}
			else { // not associated with any optname
				opt._.push(args[i]);
			}
		}
		return opt;
	}
}


/**
 * Print out the expected usage syntax for this script on the command
 * line. This is called automatically by using the -h/--help option.
 */
JsDoc.usage = function() {
	print("USAGE: java -jar js.jar jsdoc.js [OPTIONS] <SRC_DIR> <SRC_FILE> ...");
	print("");
	print("OPTIONS:");
	print("  -t=<PATH> or --template=<PATH>\n          Required. Use this template to format the output.\n");
	print("  -d=<PATH> or --directory=<PATH>\n          Output to this directory (defaults to js_docs_out).\n");
	print("  -r=<DEPTH> or --recurse=<DEPTH>\n          Descend into src directories.\n");
	print("  -a or --allfunctions\n          Include all functions, even undocumented ones.\n");
	print("  -A or --Allfunctions\n          Include all functions, even _underscored ones.\n");
	print("  -v or --verbose\n          Provide more feedback about what is happening.\n");
	print("  -l or --load\n          Load a plug-in script before processing.\n");
	print("  -h or --help\n          Show this message and exit.\n");
	
	java.lang.System.exit(0);
}

/**
 * Shortcut to Packages.java.io.FileWriter.
 */
FileWriter = Packages.java.io.FileWriter;

/**
 * Shortcut to Packages.java.io.File.
 */
File = Packages.java.io.File;

/**
 * Shortcut to Packages.java.io.File.separator.
 */
FileSeparator = Packages.java.io.File.separator;

/**
 * Gets the contents of a file.
 * @param {path|url} url
 * @throws {error} Unsupported environment.
 * @return {string} The contents of the file at the given location.
 */
ReadFile = function(path) {
	return readFile(path);
}

/**
 * Use to save content to a file.
 * @param {string} outDir Path to directory to save into.
 * @param {string} fileName Name to use for the new file.
 * @param {string} content To write to the new file.
 */
SaveFile = function(outDir, fileName, content) {
	var out = new FileWriter(outDir+FileSeparator+fileName);
	out.write(content);
	out.flush();
	out.close();
}

/**
 * Use to copy a file from one directory to another.
 * @param {string} inFile Path to the source file.
 * @param {string} outDir Path to directory to save into.
 * @param {string} fileName Name to use for the new file.
 */
CopyFile = function(inFile, outDir, fileName) {
	if (fileName == null) fileName = JsDoc.Util.fileName(inFile);
	var out = new FileWriter(outDir+FileSeparator+fileName);
	out.write(ReadFile(inFile));
	out.flush();
	out.close();
}

/**
 * Use to create a new directory.
 * @param {string} dirname Path of directory you wish to create.
 */
MakeDir = function(dirName) {
	(new File(dirName)).mkdir();
}

/**
 * This is called automatically.
 */
JsDoc.main = function() {
	if (JsDoc.opt.h || JsDoc.opt._.length == 0 || JsDoc.opt.t == "") {
		JsDoc.usage();
	}
	
	var recurse = 1;                        // default is to stay in first folder
	if (JsDoc.opt.r === true) recurse = 10; // if -r then go 10 levels down max
	if (!isNaN(parseInt(JsDoc.opt.r)))
		recurse = parseInt(JsDoc.opt.r);    // if -r=n then go n levels down max
	
	if (JsDoc.opt.d === true) { // like when user enters: -d mydir
		warn("-d option malformed.");
		JsDoc.usage();
	}
	
	//TODO: there must be a better way to find the path to the executing script?
	var thisFile;
	try {fail();}
	catch(e) {thisFile = e.fileName;}
	var thisDir = JsDoc.Util.dir(thisFile);
	
	inform("Loading: "+thisDir+"/JsPlate.js");
	load(thisDir+"/JsPlate.js");
	
	inform("Loading: "+thisDir+"/JsToke.js");
	load(thisDir+"/JsToke.js");
	
	inform("Loading: "+thisDir+"/JsParse.js");
	load(thisDir+"/JsParse.js");
	
	if (JsDoc.opt.l) {
		var loadable = JsDoc.opt.l.split(","); 
		loadable.forEach(function(i){
			inform("Loading: "+i+".");
			load(i);
		});
	}
	
	function isJs(element, index, array) {
		return /\.js$/i.test(element); // we're only interested in js files
	}
	var srcFiles = [];
	for (var d = 0; d < JsDoc.opt._.length; d++) {
		srcFiles = srcFiles.concat(
			JsDoc.Util.ls(JsDoc.opt._[d], recurse).filter(isJs)
		);
	}
	
	inform("Source files:\n\t"+srcFiles.join("\n\t"));
	
	if (!JsDoc.opt.d) JsDoc.opt.d = "js_docs_out";
	inform("making output directory: "+JsDoc.opt.d);
	MakeDir(JsDoc.opt.d);

	JsDoc.parse(srcFiles);
	JsDoc.publish();
}

JsDoc.opt = JsDoc.Util.getOptions(arguments, {d:"directory", t:"template", r:"recurse", v:"verbose", h:"help", p:"private", a:"allfunctions", A:"Allfunctions", l:"load"});
JsDoc.main();
