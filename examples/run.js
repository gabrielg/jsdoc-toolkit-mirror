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
load(__DIR__+"../app/Dumper.js");

/**
* Function : dump()
* Arguments: The data - array,hash(associative array),object
*    The level - OPTIONAL
* Returns  : The textual representation of the array.
* This function was inspired by the print_r function of PHP.
* This will accept some data as the argument and return a
* text that will be a more readable version of the
* array/hash/object that is given.
*/
function dump(arr,level) {
var dumped_text = "";
if(!level) level = 0;

//The padding given at the beginning of the line.
var level_padding = "";
for(var j=0;j<level+1;j++) level_padding += "    ";

if(typeof(arr) == 'object' && typeof(arr) != 'function') { //Array/Hashes/Objects
 for(var item in arr) {
  var value = arr[item];
 
  if(typeof(value) == 'object') { //If it is an array,
   dumped_text += level_padding + "'" + item + "' ...\n";
   dumped_text += dump(value,level+1);
  } else {
   dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
  }
 }
} else { //Stings/Chars/Numbers etc.
 dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
}
return dumped_text;
} 

function Main() {
	if (JsDoc.opt.h || JsDoc.opt._.length == 0 || JsDoc.opt.t == "") JsDoc.usage();

	if (typeof(JsDoc.opt.r) == "boolean") JsDoc.opt.r=10;
	else if (!isNaN(parseInt(JsDoc.opt.r))) JsDoc.opt.r = parseInt(JsDoc.opt.r);
	else JsDoc.opt.r = 1;
		
	if (JsDoc.opt.d === true || JsDoc.opt.t === true) { // like when a user enters: -d mydir
		LOG.warn("-d JsDoc.option malformed.");
		JsDoc.usage();
	}
	else if (!JsDoc.opt.d) {
		JsDoc.opt.d = "js_docs_out";
	}
	JsDoc.opt.d += (JsDoc.opt.d.indexOf(IO.FileSeparator)==JsDoc.opt.d.length-1)?
		"" : IO.FileSeparator;
	LOG.inform("Creating output directory: "+JsDoc.opt.d);
	IO.makeDir(JsDoc.opt.d);
	
	LOG.inform("Scanning for source files: recursion set to "+JsDoc.opt.r+" subdir"+((JsDoc.opt.r==1)?"":"s")+".");
	function isJs(element, index, array) {
		return /\.js$/i.test(element); // we're only interested in .js files
	}
	var srcFiles = [];
	for (var d = 0; d < JsDoc.opt._.length; d++) {
		srcFiles = srcFiles.concat(
			IO.ls(JsDoc.opt._[d], JsDoc.opt.r).filter(isJs)
		);
	}
	
	LOG.inform(srcFiles.length+" source file"+((srcFiles ==1)?"":"s")+" found:\n\t"+srcFiles.join("\n\t"));
	var files = JsDoc.parse(srcFiles, JsDoc.opt);
	
	print(toJsonString(files))
}

JsDoc.opt = Util.getOptions(arguments, {d:"directory", t:"template", r:"recurse", v:"verbose", h:"help", a:"allfunctions"});
Main();