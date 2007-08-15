require("app/JsHilite.js");

function basename(filename) {
	filename.match(/([^\/\\]+)\.[^\/\\]+$/);
	return RegExp.$1;
}

function publish(files, context) {
	var classTemplate = new JsPlate(context.t+"class.tmpl");
	var indexTemplate = new JsPlate(context.t+"index.tmpl");
	
	var allFiles = {};
	var allClasses = {};
	var globals = {methods:[], properties:[], alias:"GLOBALS", isStatic:true};
	
	for (var i = 0; i < files.length; i++) {
		var file_basename = basename(files[i].filename);
		var file_srcname = file_basename+".src.html";
		
		for (var s = 0; s < files[i].symbols.length; s++) {
			if (files[i].symbols[s].isa == "CONSTRUCTOR") {
				var thisClass = files[i].symbols[s];;
				thisClass.name = files[i].symbols[s].alias;
				thisClass.source = file_srcname;
				thisClass.filename = files[i].filename;
				thisClass.docs = thisClass.name+".html";
				
				if (!allClasses[thisClass.name]) allClasses[thisClass.name] = [];
				allClasses[thisClass.name].push(thisClass);
			}
			else if (files[i].symbols[s].alias == files[i].symbols[s].name) {
				if (files[i].symbols[s].isa == "FUNCTION") {
					globals.methods.push(files[i].symbols[s]);
				}
				else {
					globals.properties.push(files[i].symbols[s]);
				}
			}
		}
		
		if (!allFiles[files[i].path]) {
			var hiliter = new JsHilite(IO.readFile(files[i].path));
			IO.saveFile(context.d, file_srcname, hiliter.hilite());
		}
		files[i].source = file_srcname;
		allFiles[files[i].path] = true;
	}
	
	for (var c in allClasses) {
		outfile = c+".html";
		allClasses[c].outfile = outfile;
		var output = classTemplate.process(allClasses[c]);
		IO.saveFile(context.d, outfile, output);
	}
	
	output = classTemplate.process([globals]);
	IO.saveFile(context.d, "globals.html", output);
	
	var output = indexTemplate.process(allClasses);
	IO.saveFile(context.d, "allclasses-frame.html", output);
	IO.copyFile(context.t+"index.html", context.d);
	IO.copyFile(context.t+"splash.html", context.d);
}