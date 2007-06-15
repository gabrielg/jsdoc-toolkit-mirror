var __DIR__;
try {fail();} catch(e) {
	var nameStart = Math.max(e.fileName.lastIndexOf("/")+1, e.fileName.lastIndexOf("\\")+1, 0);
	__DIR__ = e.fileName.substring(0, nameStart-1);
	__DIR__ += (__DIR__)? "/" : "";
}

load(__DIR__+"../app/JsDoc.js");
load(__DIR__+"../app/Util.js");
load(__DIR__+"../app/JsIO.js");
load(__DIR__+"../app/Symbol.js");
load(__DIR__+"../app/JsToke.js");
load(__DIR__+"../app/JsParse.js");
load(__DIR__+"../app/DocTag.js");
load(__DIR__+"../app/Doclet.js");
load(__DIR__+"../app/JsPlate.js");
load(__DIR__+"../app/JsTestrun.js");

JsDoc.opt = {v:true, t: __DIR__+"../templates/json"};
var output;
var jsdoc;

function testFile(path) {
	JsDoc.opt._ = path;
	output = Main();
	eval(output);
}

Main = function() {
	var srcFiles = JsDoc.opt._;
	
	JsDoc.parse(srcFiles);
	JsDoc.publish();
	return(JsDoc.opt.output)
}

/*
	Tests Cases
*/

var testCases = [
	function() {
		testFile(__DIR__+"data/test2.js");
		ok('output != null', 'Output must not be null.');
		ok('typeof jsdoc != "undefined"', 'jsdoc must be undefined.');
		ok('jsdoc.files[0].symbols[0].name == "{Layout}.Element"', 'Nested commented method name can be found.');
	},
	function() {
		testFile(__DIR__+"data/test3.js");
		ok('jsdoc.files[0].symbols[0].name == "Document"', 'Nested commented object literal name can be found.');
	},
	function() {
		testFile(__DIR__+"data/test4.js");
		ok('jsdoc.files[0].symbols[0].name == "Site"', 'Mixed object literal name can be found.');
	},
	function() {
		testFile(__DIR__+"data/test5.js");
		ok('jsdoc.files[0].symbols[0].name == "{Article}.getTitle"', 'Prototype method name can be found.');
	}
];

print(testrun(testCases));
