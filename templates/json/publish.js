var unsafe = {'\b':'\\b', '\t':'\\t', '\n':'\\n', '\f':'\\f', '\r':'\\r', '"':'\\"', '\\':'\\\\'};
var escJson = function(str) {
	return (str)?
		str.replace(
			/([\x00-\x1f\\"])/g,
			function(a, b) {
				var ch = unsafe[b];
				if (ch) return ch;
				ch = b.charCodeAt();
				return '\\u00'+Math.floor(ch/16).toString(16)+(ch%16).toString(16);
			}
		) : "";
}

function publish_begin(allFiles, context) {
	context.template = new JsPlate(context.t+"file.tmpl");
	context.output = "jsdoc = {\n	files: [\n";
}

function publish_each(file, context) {
	context.output += context.template.process(file);
}

function publish_finish(allFiles, context) {
	context.output += "};\n";

	if (context.d) {
		IO.saveFile(context.d, "jsdoc.js", context.output);
	}
}