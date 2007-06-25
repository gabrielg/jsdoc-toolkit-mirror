function publish(parsedFile) {
	LOG.inform("Publishing...");
	
	if (!/\.xml/.test(parsedFile)) {
		throw new TypeError("ParsedFile '"+parsedFile+"' is not an xml file.");
	}
	
	var t = new Transformer(JsDoc.opt.t+"/xhtml.xsl");
	t.transform(parsedFile, JsDoc.opt.d+"/jsdoc.html");
	
	var t = new Transformer(JsDoc.opt.t+"/index.xsl");
	t.transform(parsedFile, JsDoc.opt.d+"/index.html");
	IO.copyFile(JsDoc.opt.t+"/style.css", JsDoc.opt.d);
}