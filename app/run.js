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

function Main(opt) {
	if (opt.h || opt._.length == 0 || opt.t == "") JsDoc.usage();

	var recurse = (opt.r === true)? 10 : 1;
	if (!isNaN(parseInt(opt.r))) recurse = parseInt(opt.r);
	
	if (opt.d === true) { // like when user enters: -d mydir
		LOG.warn("-d option malformed.");
		JsDoc.usage();
	}
	else if (!opt.d) {
		opt.d = "js_docs_out";
	}
	LOG.inform("Creating output directory: "+opt.d);
	IO.makeDir(opt.d);
	
	function isJs(element, index, array) {
		return /\.js$/i.test(element); // we're only interested in js files
	}
	var srcFiles = [];
	for (var d = 0; d < opt._.length; d++) {
		srcFiles = srcFiles.concat(
			IO.ls(opt._[d], recurse).filter(isJs)
		);
	}
	
	LOG.inform("Source files found:\n\t"+srcFiles.join("\n\t"));
	var files = JsDoc.parse(srcFiles, opt);
	
	var serializer = new JSSerializer();
	serializer.Types.UseFunction	= false;
	serializer.Prefs.SmartIndent	= true;
	serializer.Prefs.ShowLineBreaks	= true;
	serializer.Serialize(files);
	
	var xmlout = "jsdoc.xml";
	IO.saveFile(opt.d, xmlout, serializer.GetXMLString('JsDoc'));
	delete serializer;
	
	load(opt.t+"/publish.js");
	publish(opt.d+"/"+xmlout, opt);
}

Main(
	Util.getOptions(arguments, {d:"directory", t:"template", r:"recurse", v:"verbose", h:"help", a:"allfunctions"})
);