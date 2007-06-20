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
		is('jsdoc.files.file[0].symbol[0].alias', "Layout.Element", 'Nested commented method name can be found.');
	},
	function() {
		testFile(__DIR__+"data/obliterals.js");
		is('jsdoc.files.file[0].symbol[0].name', "Document", 'Nested commented object literal name can be found.');
	},
	function() {
		testFile(__DIR__+"data/oblit_func.js");
		is('jsdoc.files.file[0].symbol[0].name', "Site", 'Mixed object literal name can be found.');
	},
	function() {
		testFile(__DIR__+"data/prototypes.js");
		is('jsdoc.files.file[0].symbol[0].alias', "Article.getTitle", 'Prototype method name assigned from oblit can be found.');
		is('jsdoc.files.file[0].symbol[0].memberof', "Article", 'Prototype method memberof assigned from oblit can be found.');
		is('jsdoc.files.file[0].symbol[2].alias', "Paragraph.lines", 'Prototype property name can be found.');
		is('jsdoc.files.file[0].symbol[2].isa', "OBJECT", 'Prototype property isa can be found.');
		is('jsdoc.files.file[0].symbol[3].alias', "Paragraph.getLines", 'Prototype method name can be found.');
		is('jsdoc.files.file[0].symbol[3].isa', "METHOD", 'Prototype method isa can be found.');
	},
	function() {
		testFile(__DIR__+"data/anonfuncs.js");
		is('jsdoc.files.file[0].symbol[0].alias', "Item.name", 'Anonymous function call assigned to property can be found.');
		is('jsdoc.files.file[0].symbol[1].name', "Item.Price", 'Anonymous function call assigned to variable can be found.');
		is('jsdoc.files.file[0].symbol[2].name', "Product", 'Anonymous constructor call assigned to variable can be found.');
		is('jsdoc.files.file[0].symbol[3].isa', "OBJECT", 'Anonymous constructor property isa must be "PROPERTY".');
		is('jsdoc.files.file[0].symbol[3].alias', "Product.seller", 'Anonymous constructor property name can be found.');
	},
	function() {
		testFile(__DIR__+"data/overview.js");
		is('jsdoc.files.file[0].overview.tag[1].title', "author", 'Author tag in overview can be found.');
	},
	function() {
		testFile(__DIR__+"data/tags.js");
		is('jsdoc.files.file[0].symbol[0].tag[0].title', "status", 'User-defined tag title can be found.');
		is('jsdoc.files.file[0].symbol[0].tag[0].desc', "experimental", 'User-defined tag with desc, desc can be found.');
		is('jsdoc.files.file[0].symbol[0].tag[1].title', "deprecated", 'User-defined tag with no desc, title can be found.');
		is('jsdoc.files.file[0].symbol[0].tag[1].desc', "", 'User-defined tag with no desc, desc can be found and is empty.');
	},
	function() {
		JsDoc.opt.a = true; // grab ALL functions from now on
		
		testFile(__DIR__+"data/virtual.js");
		is('jsdoc.files.file[0].symbol[0].name', "twiddle.flick", 'Virtual doclet name can be found.');
		is('jsdoc.files.file[0].symbol[0].isa', "FUNCTION", 'Virtual doclet isa can be found.');
		is('jsdoc.files.file[0].symbol[0].desc', "Twiddle the given flick.", 'Virtual doclet desc can be found.');
		is('jsdoc.files.file[0].symbol[0].tag.length', 0, 'Virtual doclet should have no tags.');
		
		is('jsdoc.files.file[0].symbol[1].name', "zipZap", 'Undocumented function following virtual doclet name can be found.');
		
		is('jsdoc.files.file[0].symbol[2].name', "Concat", 'Virtual function doclet name can be found.');
		is('jsdoc.files.file[0].symbol[2].isa', "CONSTRUCTOR", 'Virtual function doclet isa can be found.');
		is('jsdoc.files.file[0].symbol[2].tag.length', 0, 'Virtual function doclet should have no tags.');
		is('jsdoc.files.file[0].symbol[2].param[0].name', "strX", 'Virtual function parameter name can be found.');
	},
	function() {
		testFile(__DIR__+"data/properties.js");
		is('jsdoc.files.file[0].symbol[1].property[0].name', "_associated_with", 'Property in code body is added to parent.');
	},
	function() {
		testFile(__DIR__+"data/memberof.js");
		is('jsdoc.files.file[0].symbol[1].name', "SquareMaker", 'Constructor member name can be found.');
		is('jsdoc.files.file[0].symbol[1].memberof', "ShapeFactory", 'Constructor which is a member of another constructor identified.');
		is('jsdoc.files.file[0].symbol[2].name', "Square", 'Nested constructor member name can be found.');
		is('jsdoc.files.file[0].symbol[2].memberof', "ShapeFactory.SquareMaker", 'Nested constructor which is a member of another constructor identified.');

	}
];

//// run and print

print(testrun(testCases));
