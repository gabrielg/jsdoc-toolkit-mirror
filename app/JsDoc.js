/**
 * @fileOverview An automated documentation publishing system for JavaScript.
 * @name JsDoc Toolkit
 * @author Michael Mathews <a href="mailto:micmath@gmail.com">micmath@gmail.com</a>
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
		print(" > "+msg);
	}
};

JsDoc = {};

function publish() {}

JsDoc.parse = function(srcFiles) {
	var files = [];
	
	if (typeof srcFiles == "string") srcFiles = [srcFiles];	
	var parser = new JsParse();
	
	srcFiles = srcFiles.sort();
	
	// handle setting up relationships between symbols here
	for (var f = 0; f < srcFiles.length; f++) {
		var srcFile = srcFiles[f];
		
		LOG.inform("Tokenizing: file "+(f+1)+", "+srcFile);
		var src = IO.readFile(srcFile);
		
		var tokens = new TokenReader(src).tokenize();
		LOG.inform("\t"+tokens.length+" tokens found.");
		var ts = new TokenStream(tokens);
		
		var file = new DocFile(srcFile);
		parser.parse(ts);
		LOG.inform("\t"+parser.symbols.length+" symbols found.");
		
		file.addSymbols(parser.symbols, JsDoc.opt);
		if (parser.overview) file.overview = parser.overview;
		
		files.push(file);
	}
	return files;
}

/**
 * Print out the expected usage syntax for this script on the command
 * line. This is called automatically by using the -h/--help option.
 */
JsDoc.usage = function() {
	print("USAGE: java -jar app/js.jar app/jsdoc.js [OPTIONS] <SRC_DIR> <SRC_FILE> ...");
	print("");
	print("OPTIONS:");
	print("  -t=<PATH> or --template=<PATH>\n          Required. Use this template to format the output.\n");
	print("  -d=<PATH> or --directory=<PATH>\n          Output to this directory (defaults to js_docs_out).\n");
	print("  -r=<DEPTH> or --recurse=<DEPTH>\n          Descend into src directories.\n");
	print("  -x=<EXT>[,EXT]... or --ext=<EXT>[,EXT]...\n          Scan source files with the given extension/s (defaults to js).\n");
	print("  -a or --allfunctions\n          Include all functions, even undocumented ones.\n");
	print("  -A or --Allfunctions\n          Include all functions, even undocumented, underscored ones.\n");
	print("  -p or --private\n          Include symbols tagged as private.\n");
	print("  -h or --help\n          Show this message and exit.\n");
	
	java.lang.System.exit(0);
}