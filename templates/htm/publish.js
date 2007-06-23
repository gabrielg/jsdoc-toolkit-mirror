/*function publish_begin(allFiles, context) {
	LOG.inform("Publish begin.");
	context.template = new JsPlate(context.t+"file.tmpl");
	context.output = "<?xml version=\"1.0\"?>\n<files>\n";
}*/

function publish(xmlout, opt) {
	LOG.inform("Publishing...");
	var t = new Transformer(opt.t+"/xhtml.xsl");
	t.transform(xmlout, opt.d+"/jsdoc.html");
	
	var t = new Transformer(opt.t+"/index.xsl");
	t.transform(xmlout, opt.d+"/index.html");
	IO.copyFile(opt.t+"/style.css", opt.d);
}

/*function publish_finish(allFiles, context) {
	context.output += "\n</files>\n";
	if (context.d) {
		IO.saveFile(context.d, "jsdoc.xml", context.output);
	}
	LOG.inform("Publish finished.");
}*/