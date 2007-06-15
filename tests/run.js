var __DIR__;
try {fail();} catch(e) {
	var nameStart = Math.max(e.fileName.lastIndexOf("/")+1, e.fileName.lastIndexOf("\\")+1, 0);
	__DIR__ = e.fileName.substring(0, nameStart-1);
	__DIR__ += (__DIR__)? "/" : "";
}

load(__DIR__+"../lib/JsDoc.js");
load(__DIR__+"../lib/Util.js");
load(__DIR__+"../lib/JsIO.js");
load(__DIR__+"../lib/Symbol.js");
load(__DIR__+"../lib/JsToke.js");
load(__DIR__+"../lib/JsParse.js");
load(__DIR__+"../lib/DocTag.js");
load(__DIR__+"../lib/Doclet.js");
load(__DIR__+"../lib/JsPlate.js");
load(__DIR__+"../lib/JsTestrun.js");

Main = function(options) {
	JsDoc.opt = options;
	
	var srcFiles = JsDoc.opt._;
	
	JsDoc.parse(srcFiles);
	JsDoc.publish();
	return(JsDoc.opt.output)
}

var output = Main({t: __DIR__+"../templates/json", _: __DIR__+"../tests/data/test.js"});
//print(output);
eval(output);

var testCases = [
	function() {
		ok('output != null', 'Output must not be null.');
		ok('typeof jsdoc != "undefined"', 'jsdoc must be undefined.');
	},
	function() {
		ok('jsdoc.files[0].symbols[0].name == "getFoo"', 'Symbol "getFoo" must exist.');
	}
];

var result = testrun(testCases);
print(result);
//print("jsdoc.files[0].symbols[0].name "+jsdoc.files[0].symbols[0].name);