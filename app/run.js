var __DIR__;
try {fail();} catch(e) {
	var nameStart = Math.max(e.fileName.lastIndexOf("/")+1, e.fileName.lastIndexOf("\\")+1, 0);
	__DIR__ = e.fileName.substring(0, nameStart-1);
	__DIR__ += (__DIR__)? "/" : "";
}

load(__DIR__+"JsDoc.js");
load(__DIR__+"Util.js");
load(__DIR__+"JsIO.js");
load(__DIR__+"Symbol.js");
load(__DIR__+"JsToke.js");
load(__DIR__+"JsParse.js");
load(__DIR__+"DocTag.js");
load(__DIR__+"Doclet.js");
load(__DIR__+"Serializer.js");
load(__DIR__+"SerializerJS.js");
load(__DIR__+"SerializerXML.js");
load(__DIR__+"Transformer.js");

function Main() {
	if (JsDoc.opt.h || JsDoc.opt._.length == 0 || JsDoc.opt.t == "") JsDoc.usage();

	var recurse = (JsDoc.opt.r === true)? 10 : 1;
	if (!isNaN(parseInt(JsDoc.opt.r))) recurse = parseInt(JsDoc.opt.r);
	
	if (JsDoc.opt.d === true) { // like when user enters: -d mydir
		LOG.warn("-d JsDoc.option malformed.");
		JsDoc.usage();
	}
	else if (!JsDoc.opt.d) {
		JsDoc.opt.d = "js_docs_out";
	}
	LOG.inform("Creating output directory: "+JsDoc.opt.d);
	IO.makeDir(JsDoc.opt.d);
	
	function isJs(element, index, array) {
		return /\.js$/i.test(element); // we're only interested in js files
	}
	var srcFiles = [];
	for (var d = 0; d < JsDoc.opt._.length; d++) {
		srcFiles = srcFiles.concat(
			IO.ls(JsDoc.opt._[d], recurse).filter(isJs)
		);
	}
	
	LOG.inform("Source files found:\n\t"+srcFiles.join("\n\t"));
	var files = JsDoc.parse(srcFiles, JsDoc.opt);
	
	var serializer = new JSSerializer();
	serializer.Types.UseFunction	= false;
	serializer.Prefs.SmartIndent	= true;
	serializer.Prefs.ShowLineBreaks	= true;
	serializer.Serialize(files);
	
	var outfile;
	if (JsDoc.opt.s) {
		outfile = "_jsdoc.js";
		LOG.inform("Serializing to JavaScript source...");
		IO.saveFile(JsDoc.opt.d, outfile, serializer.GetJSString('JsDoc'));
	}
	else if (JsDoc.opt.j) {
		outfile = "_jsdoc_json.js";
		load(__DIR__+"JSON.js");
		LOG.inform("Serializing to JSON...");
		IO.saveFile(JsDoc.opt.d, outfile, files.toJSONString());
	}
	else {
		outfile = "_jsdoc.xml";
		LOG.inform("Serializing to XML...");
		IO.saveFile(JsDoc.opt.d, outfile, serializer.GetXMLString('JsDoc'));
	}
	delete serializer;
	
	load(JsDoc.opt.t+"/publish.js");
	publish(JsDoc.opt.d+"/"+outfile);
}

JsDoc.opt = Util.getOptions(arguments, {d:"directory", t:"template", r:"recurse", v:"verbose", h:"help", a:"allfunctions"});
Main();