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
//load(__DIR__+"JsPlate.js");
//load(__DIR__+"JsTestrun.js");

load(__DIR__+"Serializer.js");
load(__DIR__+"SerializerJS.js");
load(__DIR__+"SerializerXML.js");
load(__DIR__+"Transformer.js");

Main = function(options) {
	JsDoc.opt = options;
	
	if (JsDoc.opt.h || JsDoc.opt._.length == 0 || JsDoc.opt.t == "") {
		JsDoc.usage();
	}
	
	var recurse = 1;                        // default is to stay in first folder
	if (JsDoc.opt.r === true) recurse = 10; // if -r then go 10 levels down max
	if (!isNaN(parseInt(JsDoc.opt.r)))
		recurse = parseInt(JsDoc.opt.r);    // if -r=n then go n levels down max
	
	if (JsDoc.opt.d === true) { // like when user enters: -d mydir
		LOG.warn("-d option malformed.");
		JsDoc.usage();
	}
	
	if (JsDoc.opt.l) {
		var loadable = JsDoc.opt.l.split(","); 
		loadable.forEach(function(i){
			LOG.inform("Loading: "+i+".");
			require(i);
		});
	}
	
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
	
	if (!JsDoc.opt.d) JsDoc.opt.d = "js_docs_out";
	LOG.inform("Creating output directory: "+JsDoc.opt.d);
	IO.makeDir(JsDoc.opt.d);

	JsDoc.parse(srcFiles);
	
	var objSerializer = new JSSerializer();
	//Prefs
	objSerializer.Types.UseFunction =	false;
	objSerializer.Prefs.SmartIndent =	true;
	objSerializer.Prefs.ShowLineBreaks =true;
	
	/*objSerializer.Prefs.SmartIndent =	true;
	objSerializer.Prefs.ShowLineBreaks =true;
	objSerializer.Prefs.ShowTypes =		true;
	//Types
	objSerializer.Types.UseNull =		true;
	objSerializer.Types.UseUndefined =	true;
	objSerializer.Types.UseArray =		true;
	objSerializer.Types.UseObject =		true;
	objSerializer.Types.UseBoolean =	true;
	objSerializer.Types.UseDate =		true;
	objSerializer.Types.UseError =		true;
	objSerializer.Types.UseFunction =	true;
	objSerializer.Types.UseNumber =		true;
	objSerializer.Types.UseRegExp =		true;
	objSerializer.Types.UseString =		true;
	objSerializer.Types.UseUserDefined =true;
	//Rules
	objSerializer.CheckInfiniteLoops =	true;
	objSerializer.MaxDepth =			true;
	*/
	objSerializer.Serialize(JsDoc.files);
	
	if (JsDoc.opt.d) {
		IO.saveFile(JsDoc.opt.d, "jsdoc.xml", objSerializer.GetXMLString('JsDoc'));
	}
	
	var t = new Transformer(JsDoc.opt.t);
	t.transform(JsDoc.opt.d+"/jsdoc.xml", JsDoc.opt.d+"/jsdoc.html");
	//frm.txaOut2.value = objSerializer.GetXMLString('MyMonkey');
	//print(myDocument);
	
	
	//print(JsDoc.files.toJSONString());
	//JsDoc.publish();
}

var options = Util.getOptions(arguments, {d:"directory", t:"template", r:"recurse", v:"verbose", h:"help", p:"private", a:"allfunctions", l:"load"});
Main(options);