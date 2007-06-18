//// load required libraries

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
	JsDoc.opt.output = ""; //reset
	output = "";
	
	output = Main();
	eval(output);
}

//// mock main

Main = function() {
	var srcFiles = JsDoc.opt._;

	JsDoc.parse(srcFiles);
	JsDoc.publish();
	return(JsDoc.opt.output)
}

//// set up some tests cases, order matters

var testCases = [
	function() {
		testFile(__DIR__+"data/functions.js");
		ok('output != null', 'Output must not be null.');
		ok('typeof jsdoc != "undefined"', 'jsdoc must be defined.');
		is('jsdoc.files[0].symbols[0].name', "{Layout}.Element", 'Nested commented method name can be found.');
	},
	function() {
		testFile(__DIR__+"data/obliterals.js");
		is('jsdoc.files[0].symbols[0].name', "Document", 'Nested commented object literal name can be found.');
	},
	function() {
		testFile(__DIR__+"data/oblit_func.js");
		is('jsdoc.files[0].symbols[0].name', "Site", 'Mixed object literal name can be found.');
	},
	function() {
		testFile(__DIR__+"data/prototypes.js");
		is('jsdoc.files[0].symbols[0].name', "{Article}.getTitle", 'Prototype method name can be found.');
	},
	function() {
		testFile(__DIR__+"data/anonfuncs.js");
		is('jsdoc.files[0].symbols[0].name', "{Item}.name", 'Anonymous function call assigned to property can be found.');
		is('jsdoc.files[0].symbols[1].name', "Item.Price", 'Anonymous function call assigned to variable can be found.');
		is('jsdoc.files[0].symbols[2].name', "Product", 'Anonymous constructor call assigned to variable can be found.');
		is('jsdoc.files[0].symbols[3].type', "PROPERTY", 'Anonymous constructor property type must be "PROPERTY".');
		is('jsdoc.files[0].symbols[3].name', "{Product}.seller", 'Anonymous constructor property name can be found.');
	},
	function() {
		testFile(__DIR__+"data/overview.js");
		is('jsdoc.files[0].overview.tags[1].title', "author", 'Author tag in overview can be found.');
	},
	function() {
		testFile(__DIR__+"data/tags.js");
		is('jsdoc.files[0].symbols[0].tags[0].title', "status", 'User-defined tag title can be found.');
		is('jsdoc.files[0].symbols[0].tags[0].desc', "experimental", 'User-defined tag with desc, desc can be found.');
		is('jsdoc.files[0].symbols[0].tags[1].title', "deprecated", 'User-defined tag with no desc, title can be found.');
		is('jsdoc.files[0].symbols[0].tags[1].desc', "", 'User-defined tag with no desc, desc can be found and is empty.');
	},
	function() {
		JsDoc.opt.a = true; // grab ALL functions from now on
		
		testFile(__DIR__+"data/alias.js");
		is('jsdoc.files[0].symbols[0].name', "{twiddle}.flick", 'Aliased doclet name can be found.');
		is('jsdoc.files[0].symbols[0].type', "OBJECT", 'Aliased doclet type can be found.');
		is('jsdoc.files[0].symbols[0].desc', "Twiddle the given flick.", 'Aliased doclet desc can be found.');
		is('jsdoc.files[0].symbols[0].tags.length', 0, 'Aliased doclet should have no tags.');
		
		is('jsdoc.files[0].symbols[1].name', "zipZap", 'Undocumented function following aliased doclet name can be found.');
		
		is('jsdoc.files[0].symbols[2].name', "Concat", 'Aliased function doclet name can be found.');
		is('jsdoc.files[0].symbols[2].type', "FUNCTION", 'Aliased function doclet type can be found.');
		is('jsdoc.files[0].symbols[2].tags.length', 0, 'Aliased function doclet should have no tags.');
		is('jsdoc.files[0].symbols[2].params[0].name', "strX", 'Aliased function parameter name can be found.');
	}
];

//// run and print

print(testrun(testCases));
