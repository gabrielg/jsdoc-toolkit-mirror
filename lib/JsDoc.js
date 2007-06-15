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
		print(" > WARNING: "+msg);
	},

	inform: function(msg) {
		if (JsDoc.opt.v) print(" > "+msg);
	}
};

JsDoc = {};

JsDoc.files = [];

/** @constructor */
JsDoc.File = function(path) {
	this.path = path;
	this.name = Util.fileName(path);
	this.overview = new Symbol(this.name, [], "", "FILE", null, new Doclet(""));;
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
		
		// TODO use Scope class
		//var parents = s.doc.getTag("memberof");
		//if (parents.length) s.name = "{"+parents[0].desc+"}."+s.name;
	}
	
	if (s.doc.getTag("constructor").length || s.doc.getTag("class").length) s.type = SYM.CONSTRUCTOR
	
	this.symbols.push(s);
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
			if (parser.symbols[s].doc.indexOf("@ignore") > -1)
				continue;
			if (parser.symbols[s].doc.indexOf("@undocumented") > -1 && !(JsDoc.opt.a||JsDoc.opt.A))
				continue;
			if (parser.symbols[s].name.indexOf("_") == 0 && !JsDoc.opt.A)
				continue;
			
			parser.symbols[s].doc = new Doclet(parser.symbols[s].doc);
			file.addSymbol(parser.symbols[s]);
		}
		if (parser.overview) file.overview = new Symbol(srcFile, [], "", "FILE", null, new Doclet(parser.overview));
		
		JsDoc.files.push(file);
	}
	
	deploy_finish(JsDoc.opt);	
}

JsDoc.publish = function(srcFiles) {
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