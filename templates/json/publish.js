function publish_begin(allFiles, context) {
	context.template = new JsPlate(context.t+"file.tmpl");
	context.output = "\n";
}

function publish_each(file, context) {
	context.output += context.template.process(file);
}

function publish_finish(allFiles, context) {
	context.output += "\n";
	if (context.d) {
		IO.saveFile(context.d, "jsdoc.js", context.output);
	}
}