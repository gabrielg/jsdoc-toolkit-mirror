function publish_begin(allFiles, context) {
	LOG.inform("Publish begin.");
	context.template = new JsPlate(context.t+"file.tmpl");
	context.output = "<?xml version=\"1.0\"?>\n<files>\n";
}

function publish_each(file, context) {
	LOG.inform("Publishing: "+file.path+".");
	context.output += context.template.process(file);
}

function publish_finish(allFiles, context) {
	context.output += "\n</files>\n";
	if (context.d) {
		IO.saveFile(context.d, "jsdoc.xml", context.output);
	}
	LOG.inform("Publish finished.");
}