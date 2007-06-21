/**
 * @fileOverview An automated documentation publishing system for JavaScript.
 * @name JsDoc Toolkit
 * @author Michael Mathews <a href="mailto:micmath@gmail.com">micmath@gmail.com</a>
 * @version 0.6b
 * @revision $Id$
 * @license <a href="http://en.wikipedia.org/wiki/MIT_License">X11/MIT License</a>
 *          (See the accompanying README file for full details.)
 */
 
LOG = {
	warn: function(msg, e) {
		if (e) msg = e.fileName+", line "+e.lineNumber+": "+msg;
		print(">> WARNING: "+msg);
	},

	inform: function(msg) {
		if (JsDoc.opt.v) print(" > "+msg);
	}
};

JsDoc = {};

/** @constructor */
JsDoc.File = function(path) {
	this.path = path;
	this.name = Util.fileName(path);
	this.overview = new Symbol(this.name, [], "FILE", new Doclet(""));;
	this.symbols = [];
}

JsDoc.File.prototype.toString = function() {
	return "[object File]";
}

JsDoc.File.prototype.addSymbol = function(s) {
	this.symbols.push(s);
}

//function deploy_begin(context) {}
//function deploy_each(source, context) {}
//function deploy_finish(context) {}
function publish_begin(allFiles, context) {}
function publish_each(file, context) {}
function publish_finish(allFiles, context) {}

JsDoc.parse = function(srcFiles) {
	JsDoc.files = [];
	
	if (typeof srcFiles == "string") srcFiles = [srcFiles];	
	//deploy_begin(JsDoc.opt);
	
	for (var i = 0; i < srcFiles.length; i++) {
		var srcFile = srcFiles[i];
		
		LOG.inform("Tokenizing: "+srcFile);
		var src = IO.readFile(srcFile);
		
		
		var tokens = new TokenReader(src).tokenize();
		LOG.inform("\t"+tokens.length+" tokens found.");
		var ts = new TokenStream(tokens);
		
		var file = new JsDoc.File(srcFile);
		
		LOG.inform("Parsing: "+srcFile);
		var parser = new JsParse();
		parser.parse(ts);
		LOG.inform("\t"+parser.symbols.length+" symbols found.");
		
		for (var s = 0; s < parser.symbols.length; s++) {
			parser.symbols[s].doc = new Doclet(parser.symbols[s].doc);
			if (parser.symbols[s].is(SYM.VIRTUAL)) {
				if (parser.symbols[s].doc.getTag("function").length)
					parser.symbols[s].isa = SYM.FUNCTION;
				else if (parser.symbols[s].doc.getTag("constructor").length)
					parser.symbols[s].isa = SYM.CONSTRUCTOR;
				else parser.symbols[s].isa = SYM.OBJECT;
			}
			
			if (parser.symbols[s].doc.getTag("constructor").length || parser.symbols[s].doc.getTag("class").length)
				parser.symbols[s].isa = SYM.CONSTRUCTOR
	
			if (parser.symbols[s].doc.getTag("ignore").length)
				continue;
			if (parser.symbols[s].doc.getTag("undocumented").length && !JsDoc.opt.a)
				continue;
			
			if (parser.symbols[s].doc.getTag("memberof").length)
				parser.symbols[s].name = parser.symbols[s].doc.getTag("memberof")[0]+"/"+parser.symbols[s].name;
			if (parser.symbols[s].doc.getTag("type").length)
				parser.symbols[s].type = parser.symbols[s].doc.getTag("type").join(", ");
			
			// is this a member of another object?
			if (parser.symbols[s].name.indexOf("/") > -1) {
				var parts = parser.symbols[s].name.match(/^(.+)\/([^\/]+)$/);
				var parentName = parts[1].replace(/\//g, ".");
				var childName = parts[2];
				var parent;
				
				// is the parent defined?
				for (var i = 0; i < file.symbols.length; i++) {
					if (file.symbols[i].alias == parentName) {
						parent = file.symbols[i];
						break;
					}
				}

				if (!parent) LOG.warn("Member '"+childName+"' documented but no documentation exists for parent object '"+parentName+"'.");
				else {
					if (parser.symbols[s].is("OBJECT")) parent.properties.push(childName);
					if (parser.symbols[s].is("FUNCTION")) parent.methods.push(childName);
				}
				parser.symbols[s].alias = parser.symbols[s].name.replace(/\//g, ".");
				parser.symbols[s].name = childName;
				parser.symbols[s].memberof = parentName;
			}
			
			file.addSymbol(parser.symbols[s]);
			
		}
		if (parser.overview) file.overview = new Symbol(srcFile, [], "FILE", new Doclet(parser.overview));
		
		JsDoc.files.push(file);
	}
	
	//deploy_finish(JsDoc.opt);	
}

JsDoc.publish = function() {
	if (JsDoc.opt.t === undefined) {
		LOG.warn("No template provided.");
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
	print("  -v or --verbose\n          Provide more feedback about what is happening.\n");
	print("  -l or --load\n          Load a plug-in script before processing.\n");
	print("  -h or --help\n          Show this message and exit.\n");
	
	java.lang.System.exit(0);
}