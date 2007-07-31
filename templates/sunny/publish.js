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
				var classname = files[i].symbols[s].alias;
				allClasses[classname] = files[i].symbols[s];
				allClasses[classname].source = file_srcname;
				allClasses[classname].filename = files[i].filename;
				allClasses[classname].docs = classname+".html";
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

		var hiliter = new JsHilite(IO.readFile(__DIR__+files[i].path));
		IO.saveFile(context.d, file_srcname, hiliter.hilite());
		
		files[i].source = file_srcname;
		
	}
	
	for (var c in allClasses) {
		outfile = c+".html";
		allClasses[c].outfile = outfile;
		var output = classTemplate.process(allClasses[c]);
		IO.saveFile(context.d, outfile, output);
	}
	
	output = classTemplate.process(globals);
	IO.saveFile(context.d, "globals.html", output);
	
	var output = indexTemplate.process(allClasses);
	IO.saveFile(context.d, "allclasses-frame.html", output);
	IO.copyFile(context.t+"index.html", context.d);
	
	
		/*
		if (context.d) {
			var our_name = "_"+((i+1<10)?"0"+(i+1):(i+1))+".htm";
			index[our_name] = { name: (files[i].filename), classes:[]};
		
			for (var s = 0; s < files[i].symbols.length; s++) {
				if (files[i].symbols[s].isa == "CONSTRUCTOR") {
					index[our_name].classes.push(files[i].symbols[s].alias);
				}
			}	
			
			// make copy original source code with syntax hiliting
			var sourceFile = files[i].path;
			if (sourceFile) {
				var hiliter = new JsHilite(IO.readFile(__DIR__+sourceFile));
				IO.saveFile(context.d, "src"+our_name, hiliter.hilite());
				
				files[i].source = "src"+our_name;
			}
		//	var output = file_template.process(files[i]);
		//	IO.saveFile(context.d, our_name, output);
		}*/
	//}
	
	/*var indx_template = new JsPlate(context.t+"index.tmpl");
	var index = indx_template.process(index);
	if (context.d) {
		IO.saveFile(context.d, "file_list.htm", index);
		
		IO.copyFile(context.t+"index.htm", context.d);
		IO.copyFile(context.t+"splash.htm", context.d);
		IO.copyFile(context.t+"default.css", context.d);
	}*/
}